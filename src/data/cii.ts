/**
 * Cost Inflation Index (CII) for India, financial-year wise.
 * Source: Income Tax Department notifications.
 * FY 2025-26 CII 376 was notified by CBDT Notification No. 70/2025 dated 2025-07-01.
 */
export const CII: Record<string, number> = {
  '2001-02': 100,
  '2002-03': 105,
  '2003-04': 109,
  '2004-05': 113,
  '2005-06': 117,
  '2006-07': 122,
  '2007-08': 129,
  '2008-09': 137,
  '2009-10': 148,
  '2010-11': 167,
  '2011-12': 184,
  '2012-13': 200,
  '2013-14': 220,
  '2014-15': 240,
  '2015-16': 254,
  '2016-17': 264,
  '2017-18': 272,
  '2018-19': 280,
  '2019-20': 289,
  '2020-21': 301,
  '2021-22': 317,
  '2022-23': 331,
  '2023-24': 348,
  '2024-25': 363,
  '2025-26': 376,
}

export const FY_LIST = Object.keys(CII)

export const CII_LAST_UPDATED = '2026-06-22'

export const CII_SOURCE_URLS = [
  'https://www.incometaxindia.gov.in/cost-inflation-index',
] as const
