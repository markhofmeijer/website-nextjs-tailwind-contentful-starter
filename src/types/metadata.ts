import { ISEO } from "./seo"

export interface IMetadata {
  clientName: string
  clientAddress?: string | null
  clientZipCode?: string | null
  clientCity?: string | null
  clientPhone?: string | null
  clientEmail: string
  clientBankAccount?: string | null
  clientOpeningHours?: string | null
  clientWebshop?: string | null
  clientSocialMediaLinkedIn?: string | null
  clientSocialMediaTwitter?: string | null
  clientSocialMediaFacebook?: string | null
  clientSocialMediaInstagram?: string | null
  clientSocialMediaYouTube?: string | null
  seo: ISEO
  updatedAt: string
}
