import getClient from "../contentful"
import metadataParser from "./metadataParser"

import type { ISiteMetadataSkeleton, LOCALE_CODE } from "@/types/contentful"
import { IMetadata } from "@/types/metadata"

export default async function getSiteMetadata(preview = false): Promise<IMetadata> {
  const entries = await getClient(preview).getEntries<ISiteMetadataSkeleton, LOCALE_CODE>({
    content_type: "siteMetadata",
  })

  const metaData = entries.items.map(metadataParser)

  return metaData[0]
}
