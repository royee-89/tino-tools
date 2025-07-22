import { useState, useEffect, useMemo } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Table, Thead, Tr, Th, Tbody, Td, Badge, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
const LineChart = dynamic(() => import('./LineChart'), { ssr: false })
import { ViewIcon } from '@chakra-ui/icons'
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

if (typeof window !== 'undefined') {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend)
}

// 辅助加载 JSON
async function loadJson(relativePath) {
  const url = `/api/insurance-data?file=${encodeURI(relativePath)}`
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

// 计算每个账户的各倍数首次出现行索引
function computeMarkers(rows) {
  const keys = ['cash1', 'cash2', 'cash3', 'cash3fh', 'cash4', 'cash4fh'];
  const markers = {};
  keys.forEach(k => {
    const map = {};
    rows.forEach((r, i) => {
      const val = parseFloat(r[k] || '0');
      const multiple = Math.floor(val / 100000);
      for (let m = 1; m <= multiple; m++) {
        if (map[m] === undefined) {
          map[m] = i;
        }
      }
    });
    markers[k] = map;
  });
  return markers;
}

export default function ComparePage() {
  const [data10, setData10] = useState([])
  const [data25, setData25] = useState([])
  const [marker10, setMarker10] = useState({})
  const [marker25, setMarker25] = useState({})
  const [tabIndex, setTabIndex] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalChartData, setModalChartData] = useState(null)

  // 预计算 Charts 数据
  const chartData10 = useMemo(() => ({
    labels: data10.map(r => r.year),
    datasets: [
      { label: '鑫盈家', data: data10.map(r=>parseFloat(r.cash1||0)), borderColor: '#3182ce', tension:0.3 },
      { label: '守护神', data: data10.map(r=>parseFloat(r.cash2||0)), borderColor: '#2f855a', tension:0.3 },
      { label: '福满盈固定', data: data10.map(r=>parseFloat(r.cash3||0)), borderColor: '#d69e2e', tension:0.3 },
      { label: '福满盈固+红', data: data10.map(r=>parseFloat(r.cash3fh||0)), borderColor: '#b7791f', tension:0.3 },
      { label: '一生中意固定', data: data10.map(r=>parseFloat(r.cash4||0)), borderColor: '#805ad5', tension:0.3 },
      { label: '一生中意固+红', data: data10.map(r=>parseFloat(r.cash4fh||0)), borderColor: '#6b46c1', tension:0.3 },
    ]
  }), [data10])
  const chartData25 = useMemo(() => ({
    labels: data25.map(r => r.year),
    datasets: [
      { label: '鑫盈家', data: data25.map(r=>parseFloat(r.cash1||0)), borderColor: '#3182ce', tension:0.3 },
      { label: '守护神', data: data25.map(r=>parseFloat(r.cash2||0)), borderColor: '#2f855a', tension:0.3 },
      { label: '福满盈固定', data: data25.map(r=>parseFloat(r.cash3||0)), borderColor: '#d69e2e', tension:0.3 },
      { label: '福满盈固+红', data: data25.map(r=>parseFloat(r.cash3fh||0)), borderColor: '#b7791f', tension:0.3 },
      { label: '一生中意固定', data: data25.map(r=>parseFloat(r.cash4||0)), borderColor: '#805ad5', tension:0.3 },
      { label: '一生中意固+红', data: data25.map(r=>parseFloat(r.cash4fh||0)), borderColor: '#6b46c1', tension:0.3 },
    ]
  }), [data25])

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
    // 收集需要展示的行索引：包括首次倍数出现，以及特殊年龄
    const highlightIdx = new Set();
    Object.values(markers).forEach(map => {
      Object.values(map).forEach(idx => highlightIdx.add(idx));
    });
    const shouldShow = (idx, ageStr) => {
      const age = parseInt(ageStr, 10);
      const paying = parseFloat(rows[idx].premiumYear || '0') > 0;
      return (
        paying ||
        age === 18 ||
        age % 10 === 0 ||
        age >= 100 ||
        highlightIdx.has(idx)
      );
    };
    return (
      <Box position="relative" mb={6}>
        <Box overflow="auto" maxH="70vh" border="1px" borderColor="gray.200">
          <Table size="sm" variant="striped" colorScheme="gray" position="relative">
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
                if (!shouldShow(rowIndex, r.age)) return null;
                return (
                  <Tr key={r.year}>
                    <Td>{r.year}</Td>
                    <Td>{r.age}</Td>
                    <Td isNumeric>{r.premiumYear}</Td>
                    <Td isNumeric>{r.premiumTotal}</Td>
                    {['cash1','cash2','cash3','cash3fh','cash4','cash4fh'].map((key,idx)=>(
                      <Td key={key} isNumeric position="relative">
                        {r[key]}
                        {/* 右上角倍数标记 */}
                        {(() => {
                          const val = parseFloat(r[key] || '0');
                          const multiple = Math.floor(val / 100000);
                          // 根据倍数动态计算绿色深度，从 green.300 开始，每增加一级加100，最大 green.800
                          const shade = Math.min(800, 200 + multiple * 100);
                          const bgColor = `green.${shade}`;
                          // 仅标注首个倍数出现的行
                          if (multiple >= 1 && markers[key]?.[multiple] === rowIndex) {
                            return (
                              <Box
                                position="absolute"
                                top="2px"
                                right="2px"
                                bg={bgColor}
                                color="white"
                                px="2px"
                                fontSize="xs"
                                borderRadius="2px"
                                zIndex={0}
                              >
                                {`x${multiple}`}
                              </Box>
                            );
                          }
                          return null;
                        })()}
                      </Td>
                    ))}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box position="relative">
        {/* 查看增长曲线按钮 */}
        <IconButton
          aria-label="查看增长曲线"
          icon={<ViewIcon />}
          size="sm"
          position="absolute"
          top={2}
          right={2}
          zIndex={2}
          onClick={() => {
            setModalChartData(tabIndex === 0 ? chartData10 : chartData25)
            onOpen()
          }}
        />
        {/* 数据表 */}
        <Tabs
          mt="10px"
          index={tabIndex}
          onChange={(index) => setTabIndex(index)}
          variant="enclosed"
          colorScheme="green"
        >
          <TabList>
            <Tab>1万10年缴</Tab>
            <Tab>2万5年缴</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>{renderTable(data10, marker10)}</TabPanel>
            <TabPanel>{renderTable(data25, marker25)}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="90vw">
          <ModalHeader>现金价值增长曲线</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalChartData && <LineChart data={modalChartData} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
} 