import * as migration_20261103_181501_initial from './20261103_181501_initial';
import * as migration_20261104_143218_s3_storage_fields from './20261104_143218_s3_storage_fields';
import * as migration_20261104_174226_homepage_sections from './20261104_174226_homepage_sections';
import * as migration_20261104_174500_homepage_redesign_content from './20261104_174500_homepage_redesign_content';
import * as migration_20261104_183628_about_engagements_featured from './20261104_183628_about_engagements_featured';
import * as migration_20261104_183700_credibility_content from './20261104_183700_credibility_content';
import * as migration_20261104_190000_remove_aptiv from './20261104_190000_remove_aptiv';
import * as migration_20261104_191000_practice_areas from './20261104_191000_practice_areas';
import * as migration_20261104_225546_seo_fields from './20261104_225546_seo_fields';
import * as migration_20261104_225600_seo_defaults from './20261104_225600_seo_defaults';
import * as migration_20261105_000154_faqs from './20261105_000154_faqs';
import * as migration_20261105_000300_faq_content from './20261105_000300_faq_content';

export const migrations = [
  {
    up: migration_20261103_181501_initial.up,
    down: migration_20261103_181501_initial.down,
    name: '20261103_181501_initial',
  },
  {
    up: migration_20261104_143218_s3_storage_fields.up,
    down: migration_20261104_143218_s3_storage_fields.down,
    name: '20261104_143218_s3_storage_fields',
  },
  {
    up: migration_20261104_174226_homepage_sections.up,
    down: migration_20261104_174226_homepage_sections.down,
    name: '20261104_174226_homepage_sections',
  },
  {
    up: migration_20261104_174500_homepage_redesign_content.up,
    down: migration_20261104_174500_homepage_redesign_content.down,
    name: '20261104_174500_homepage_redesign_content',
  },
  {
    up: migration_20261104_183628_about_engagements_featured.up,
    down: migration_20261104_183628_about_engagements_featured.down,
    name: '20261104_183628_about_engagements_featured',
  },
  {
    up: migration_20261104_183700_credibility_content.up,
    down: migration_20261104_183700_credibility_content.down,
    name: '20261104_183700_credibility_content',
  },
  {
    up: migration_20261104_190000_remove_aptiv.up,
    down: migration_20261104_190000_remove_aptiv.down,
    name: '20261104_190000_remove_aptiv',
  },
  {
    up: migration_20261104_191000_practice_areas.up,
    down: migration_20261104_191000_practice_areas.down,
    name: '20261104_191000_practice_areas',
  },
  {
    up: migration_20261104_225546_seo_fields.up,
    down: migration_20261104_225546_seo_fields.down,
    name: '20261104_225546_seo_fields',
  },
  {
    up: migration_20261104_225600_seo_defaults.up,
    down: migration_20261104_225600_seo_defaults.down,
    name: '20261104_225600_seo_defaults',
  },
  {
    up: migration_20261105_000154_faqs.up,
    down: migration_20261105_000154_faqs.down,
    name: '20261105_000154_faqs'
  },
  {
    up: migration_20261105_000300_faq_content.up,
    down: migration_20261105_000300_faq_content.down,
    name: '20261105_000300_faq_content',
  },
];
