import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

const ApiHandler: NextApiHandler = (_: NextApiRequest, res: NextApiResponse) => {
  // Exit preview mode
  res.clearPreviewData()

  // Redirect user to index page
  res.writeHead(307, { Location: "/" })
  res.end()
}

export default ApiHandler
