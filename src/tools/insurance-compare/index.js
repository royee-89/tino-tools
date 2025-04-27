import dynamic from 'next/dynamic'

const DetailComponent = dynamic(() => import('./pages/ComparePage'), { ssr: false })

export const config = {
  info: {
    id: 'insurance-compare',
    name: '保险产品现金价值比较',
    description: '对比不同缴费方案下多款终身寿险的现金价值',
    icon: '💰',
    category: 'finance',
    tags: ['insurance', 'compare']
  },
  routes: {
    index: '/tools/insurance-compare'
  },
  components: {
    detail: DetailComponent
  }
}

export default config 