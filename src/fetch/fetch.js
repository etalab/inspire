import superfetch from '../helpers/superfetch'
import { convertFilters } from '../helpers/manageFilters'
import qs from 'qs'
const _f = superfetch;

export function fetchMetrics(catalogId) {
  if (!catalogId) return Promise.reject(new Error('catalogId is required'));
  return _f(`https://inspire.data.gouv.fr/api/geogw/catalogs/${catalogId}/metrics`);
}

export function fetchCatalog(catalogId) {
  if (!catalogId) return Promise.reject(new Error('catalogId is required'));
  return  _f(`https://inspire.data.gouv.fr/api/geogw/catalogs/${catalogId}`);
}

export function fetchCatalogs() {
  return _f('https://inspire.data.gouv.fr/api/geogw/catalogs');
}

export function fetchHarvest(catalogId, harvestId) {
  if (!catalogId) return Promise.reject(new Error('catalogId is required'))
  if (!harvestId) return Promise.reject(new Error('harvestId is required'))
  return _f(`https://inspire.data.gouv.fr/api/geogw/services/${catalogId}/synchronizations/${harvestId}`)
}

export function fetchHarvests(catalogId) {
  if (!catalogId) return Promise.reject(new Error('catalogId is required'))
  return _f(`https://inspire.data.gouv.fr/api/geogw/services/${catalogId}/synchronizations`)
}

export function fetchGlobalMetrics() {
  return _f('https://inspire.data.gouv.fr/dgv/api/datasets/metrics');
}

export function fetchDataset(datasetId) {
  if (!datasetId) return Promise.reject(new Error('datasetId is required'))
  return _f(`https://inspire.data.gouv.fr/api/geogw/records/${datasetId}`)
}

export function buildSearchQuery(q, filters, page) {
  const qsFilters = convertFilters(filters)
  const query = qs.stringify({q, page, ...qsFilters}, { indices: false })

  return query
}

export function search(q, filters, offset) {
  const qsFilters = convertFilters(filters)
  const query = qs.stringify({q, offset, ...qsFilters}, { indices: false })

  return _f('https://inspire.data.gouv.fr/api/geogw/records?' + query)
}
