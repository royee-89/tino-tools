import { useState, useEffect } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Table, Thead, Tr, Th, Tbody, Td, chakra, Tooltip, Badge } from '@chakra-ui/react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js'
import _ from 'lodash'
import LineChart from './LineChart'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend)

// 辅助加载 JSON
async function loadJson(relativePath) {
  const url = `/api/insurance-data?file=${encodeURIComponent(relativePath)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('load fail')
  return res.json()
}

function buildFileMap() {
  return {
    固收: {
      '1-10': [
        { name: '中英鑫盈家', file: '固收/中英人寿鑫盈家终身寿险1 - 10.json' },
        { name: '爱心守护神', file: '固收/爱心人寿守护神2.0终身寿险1 - 10.json' },
      ],
      '2-5': [
        { name: '中英鑫盈家', file: '固收/中英人寿鑫盈家终身寿险2 - 5.json' },
        { name: '爱心守护神', file: '固收/爱心人寿守护神2.0终身寿险2 - 5.json' },
      ],
    },
    分红: {
      '1-10': [
        { name: '福满盈3.0', file: '分红/中英人寿福满盈3.0终身寿险1 - 10（红利交清增额）.json' },
        { name: '一生中意', file: '分红/中意一生中意（尊享版）终身寿险 1 - 10.json' },
      ],
      '2-5': [
        { name: '福满盈3.0', file: '分红/中英人寿福满盈3.0终身寿险2 - 5（红利交清增额）.json' },
        { name: '一生中意', file: '分红/中意一生中意（尊享版）终身寿险 2 - 5.json' },
      ],
    }
  }
}

function extractRows(fixedArr, dividendArr) {
  // 假设固收数组第一条覆盖所有保单年度
  return fixedArr[0].data.benefitTableBodyList.map((row, idx) => {
    const fix1 = fixedArr[0].data.benefitTableBodyList[idx]
    const fix2 = fixedArr[1].data.benefitTableBodyList[idx]
    const div1 = dividendArr[0].data.benefitTableBodyList[idx]
    const div1fh = dividendArr[0].data.fhDividendBenefitData?.benefitTableBodyList[idx]
    const div2 = dividendArr[1].data.benefitTableBodyList[idx]
    const div2fh = dividendArr[1].data.fhDividendBenefitData?.benefitTableBodyList[idx]

    return {
      year: fix1.y,
      age: fix1.a,
      premiumYear: fix1.premiumYear,
      premiumTotal: fix1.premiumTotal,
      cash1: fix1.cash,
      cash2: fix2.cash,
      cash3: div1.cash,
      cash3fh: div1fh?.fhcash,
      cash4: div2.cash,
      cash4fh: div2fh?.fhcash,
    }
  })
}

// 计算每个账户的回本/翻倍行索引
function computeMarkers(rows) {
  const keys = ['cash1', 'cash2', 'cash3', 'cash3fh', 'cash4', 'cash4fh']
  const markers = {}
  keys.forEach(k => {
    let recoup = -1, dbl = -1
    rows.forEach((r,i)=>{
      const val = parseFloat(r[k] || '0')
      if (recoup===-1 && val >= 100000) recoup = i
      if (dbl===-1 && val >= 200000) dbl = i
    })
    markers[k] = {recoup, dbl}
  })
  return markers
}

export default function ComparePage() {
  const [data10, setData10] = useState([])
  const [data25, setData25] = useState([])
  const [marker10, setMarker10] = useState({})
  const [marker25, setMarker25] = useState({})

  useEffect(() => {
    async function fetchData() {
      const map = buildFileMap()
      // 1-10
      const fixed10 = await Promise.all(map.固收['1-10'].map(i => loadJson(i.file)))
      const div10 = await Promise.all(map.分红['1-10'].map(i => loadJson(i.file)))
      const rows10 = extractRows(fixed10, div10)
      setData10(rows10)
      setMarker10(computeMarkers(rows10))
      const fixed25 = await Promise.all(map.固收['2-5'].map(i => loadJson(i.file)))
      const div25 = await Promise.all(map.分红['2-5'].map(i => loadJson(i.file)))
      const rows25 = extractRows(fixed25, div25)
      setData25(rows25)
      setMarker25(computeMarkers(rows25))
    }
    fetchData()
  }, [])

  const renderTable = (rows, markers) => {
    // 收集需要展示的行索引
    const highlightIdx = new Set()
    // 来自回本/翻倍
    Object.values(markers).forEach(m => {
      if (m.recoup >= 0) highlightIdx.add(m.recoup)
      if (m.dbl >= 0) highlightIdx.add(m.dbl)
    })

    const shouldShow = (idx, ageStr) => {
      const age = parseInt(ageStr)
      const paying = parseFloat(rows[idx].premiumYear || '0') > 0
      return paying || highlightIdx.has(idx) || age === 18 || age % 10 === 0 || age >= 100
    }

    // 图表数据
    const chartData = {
      labels: rows.map(r => r.year),
      datasets: [
        { label: '鑫盈家', data: rows.map(r=>parseFloat(r.cash1||0)), borderColor: '#3182ce', tension:0.3 },
        { label: '守护神', data: rows.map(r=>parseFloat(r.cash2||0)), borderColor: '#2f855a', tension:0.3 },
        { label: '福满盈固定', data: rows.map(r=>parseFloat(r.cash3||0)), borderColor: '#d69e2e', tension:0.3 },
        { label: '福满盈固+红', data: rows.map(r=>parseFloat(r.cash3fh||0)), borderColor: '#b7791f', tension:0.3 },
        { label: '一生中意固定', data: rows.map(r=>parseFloat(r.cash4||0)), borderColor: '#805ad5', tension:0.3 },
        { label: '一生中意固+红', data: rows.map(r=>parseFloat(r.cash4fh||0)), borderColor: '#6b46c1', tension:0.3 },
      ]
    }

    return (
      <Box overflow="auto" maxH="70vh" border="1px" borderColor="gray.200" mb={6}>
        <Table size="sm" position="relative">
          <Thead position="sticky" top={0} bg="gray.50" zIndex={1}>
            <Tr>
              <Th rowSpan={2}>保单年度</Th>
              <Th rowSpan={2}>年龄</Th>
              <Th rowSpan={2}>年度保费</Th>
              <Th rowSpan={2}>累计保费</Th>
              <Th colSpan={1}>中英人寿鑫盈家终身寿险</Th>
              <Th colSpan={1}>爱心人寿守护神2.0终身寿险</Th>
              <Th colSpan={2}>中英人寿福满盈3.0终身寿险</Th>
              <Th colSpan={2}>中意一生中意（尊享版）终身寿险</Th>
            </Tr>
            <Tr>
              <Th>账户价值</Th>
              <Th>账户价值</Th>
              <Th>固定账户价值</Th>
              <Th>固定+红利账户价值</Th>
              <Th>固定账户价值</Th>
              <Th>固定+红利账户价值</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r, rowIndex) => {
              if (!shouldShow(rowIndex, r.age)) return null
              return (
                <Tr key={r.year}>
                  <Td>{r.year}</Td>
                  <Td>{r.age}</Td>
                  <Td isNumeric>{r.premiumYear}</Td>
                  <Td isNumeric>{r.premiumTotal}</Td>
                  {['cash1','cash2','cash3','cash3fh','cash4','cash4fh'].map((key,idx)=>(
                    <Td key={key} isNumeric>
                      {r[key]}
                      {markers[key]?.recoup===rowIndex && <Badge ml={1} colorScheme="green">回本</Badge>}
                      {markers[key]?.dbl===rowIndex && <Badge ml={1} colorScheme="blue">翻倍</Badge>}
                    </Td>
                  ))}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
        {/* 曲线图 - 固定底部 */}
        <Box position="sticky" bottom="0" bg="white" pt={4} pb={2} zIndex={5} boxShadow="0 -2px 6px rgba(0,0,0,0.05)">
          <LineChart data={chartData} />
        </Box>
      </Box>
    )
  }

  return (
    <Tabs variant="enclosed" colorScheme="green">
      <TabList>
        <Tab>1万10年缴</Tab>
        <Tab>2万5年缴</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{renderTable(data10, marker10)}</TabPanel>
        <TabPanel>{renderTable(data25, marker25)}</TabPanel>
      </TabPanels>
    </Tabs>
  )
} 