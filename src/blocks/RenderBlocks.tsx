import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import { getCachedSiteSettings } from '@/utilities/getGlobals'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'
import { isFeatureEnabled } from '@/utilities/features'
import { stripDisabledPostLinks } from '@/utilities/stripDisabledPostLinks'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

import { BlockSection } from '@/components/BlockSection'
import { FAQBlock } from '@/blocks/FAQ/Component'
import { FeatureGridBlock } from '@/blocks/FeatureGrid/Component'
import { GalleryBlock } from '@/blocks/Gallery/Component'
import { LegalNoticeBlock } from '@/blocks/LegalNotice/Component'
import { PrivacyPolicyBlock } from '@/blocks/PrivacyPolicy/Component'
import { LogoCloudBlock } from '@/blocks/LogoCloud/Component'
import { PricingTableBlock } from '@/blocks/PricingTable/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlock,
  featureGrid: FeatureGridBlock,
  formBlock: FormBlock,
  gallery: GalleryBlock,
  legalNotice: LegalNoticeBlock,
  logoCloud: LogoCloudBlock,
  mediaBlock: MediaBlock,
  pricingTable: PricingTableBlock,
  privacyPolicy: PrivacyPolicyBlock,
  stats: StatsBlock,
  testimonials: TestimonialsBlock,
}

export const RenderBlocks = async (props: {
  blocks: Page['layout'][0][]
  locale: Locale
}) => {
  const { locale } = props
  const blogEnabled = await isFeatureEnabled('blog')
  const blocks = (await stripDisabledPostLinks(props.blocks)).filter(
    (b) => blogEnabled || b.blockType !== 'archive',
  )

  const privacy = blocks.some((b) => b.blockType === 'formBlock')
    ? (await getCachedSiteSettings(locale)())?.legalPages?.privacyPolicy
    : undefined
  const privacyHref =
    privacy && typeof privacy === 'object' ? getLocalizedPath(locale, privacy.slug) : undefined

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <BlockSection
                  background={block.background}
                  key={index}
                  paddingBottom={block.paddingBottom}
                  paddingTop={block.paddingTop}
                >
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} locale={locale} privacyHref={privacyHref} disableInnerContainer />
                </BlockSection>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
