import { Entry } from "contentful"

import seoParser from "../seo/seoParser"

import { ISiteMetadataFields } from "@/types/contentful"
import { IMetadata } from "@/types/metadata"

export default function metadataParser({ sys, fields }: Entry<ISiteMetadataFields>): IMetadata {
  return {
    clientName: fields.client_name,
    clientAddress: fields.client_address ?? null,
    clientZipCode: fields.client_zipCode ?? null,
    clientCity: fields.client_city ?? null,
    clientPhone: fields.client_phone ?? null,
    clientEmail: fields.client_email,
    clientBankAccount: fields.client_bankAccount ?? null,
    clientOpeningHours: fields.client_openingHours ?? null,
    clientWebshop: fields.client_webshop ?? null,
    clientSocialMediaLinkedIn: fields.client_socialMediaLinkedIn ?? null,
    clientSocialMediaTwitter: fields.client_socialMediaTwitter ?? null,
    clientSocialMediaFacebook: fields.client_socialMediaFacebook ?? null,
    clientSocialMediaInstagram: fields.client_socialMediaInstagram ?? null,
    clientSocialMediaYouTube: fields.client_socialMediaYouTube ?? null,
    seo: seoParser(fields),
    updatedAt: sys.updatedAt,
  }
}
