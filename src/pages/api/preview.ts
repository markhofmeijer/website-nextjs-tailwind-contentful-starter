import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

import getClient from "@/utils/contentful/contentful"

interface IData {
  message: string
}

const ApiHandler: NextApiHandler<IData> = async (
  req: NextApiRequest,
  res: NextApiResponse<IData>
) => {
  const { secret, id, slug } = req.query

  // Security checks
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return res.status(401).json({ message: "Invalid token" })
  }

  try {
    await getClient(true).getEntry(id.toString()) // Throws an error if not exists
  } catch (error) {
    return res.status(401).json({ message: "Invalid metadata" })
  }

  // Enable preview mode by setting cookies (expires in 30 minutes)
  res.setPreviewData({}, { maxAge: 60 * 30 })

  // Redirect to request page
  const url = slug === "/home" ? "/" : slug
  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${url}" />
    <script>window.location.href = '${url}'</script>
    </head>`
  )
  res.end()
}

export default ApiHandler
