import { ContentfulClientApi, createClient } from "contentful"

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
})

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || "",
  host: "preview.contentful.com",
})

export default function getClient(preview = false): ContentfulClientApi {
  return preview ? previewClient : client
}
