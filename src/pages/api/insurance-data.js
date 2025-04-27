import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { file } = req.query
  if (!file) {
    return res.status(400).json({ error: 'file param required' })
  }
  // 防止路径穿越
  const baseDir = path.join(process.cwd(), '产品比较数据')
  const targetPath = path.join(baseDir, file)
  if (!targetPath.startsWith(baseDir)) {
    return res.status(400).json({ error: 'invalid path' })
  }
  try {
    const data = fs.readFileSync(targetPath, 'utf8')
    return res.status(200).json(JSON.parse(data))
  } catch (e) {
    return res.status(404).json({ error: 'not found' })
  }
} 