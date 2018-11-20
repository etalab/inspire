import formats from '../formats'
import licenses from '../licenses'
import {generateDistributionInfo} from '../distribution'

export default (identifier, url, metadata, distributions) => {
  let license
  if (metadata.license in licenses) {
    license = licenses[metadata.license].link
  }

  const schemaDistributions = []
  for (const distribution of distributions) {
    if (distribution.available) {
      const {link, layerName} = generateDistributionInfo(distribution)

      for (const format of formats) {
        schemaDistributions.push({
          '@type': 'DataDownload',
          contentUrl: `${link}?format=${format.format}&projection=${format.projection}`,
          name: `${layerName} - ${format.format}`
        })
      }
    }
  }

  return {
    '@context': 'http://schema.org',
    '@type': 'Dataset',
    identifier,
    name: metadata.title,
    url,

    description: metadata.description,
    dateCreated: metadata.creationDate,
    dateModified: metadata.revisionDate || metadata.creationDate,
    keywords: (metadata.keywords || []).join(','),
    license,

    distribution: schemaDistributions
  }
}
