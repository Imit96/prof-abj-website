import { config, collection, singleton, fields } from '@keystatic/core';

/**
 * Content model for the site. Everything Prof. Abolaji edits lives here.
 * Admin UI: /keystatic  (local files in dev, GitHub/Keystatic Cloud in production).
 *
 * Storage:
 *  - Set PUBLIC_KEYSTATIC_CLOUD_PROJECT (e.g. "team-name/project-name") to use Keystatic Cloud
 *    so he can sign in with an email address instead of a GitHub account.
 *  - Otherwise production falls back to GitHub storage using PUBLIC_KEYSTATIC_GITHUB_REPO ("owner/repo").
 */
const cloudProject = import.meta.env.PUBLIC_KEYSTATIC_CLOUD_PROJECT as string | undefined;
const githubRepo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const storage = import.meta.env.DEV
  ? ({ kind: 'local' } as const)
  : cloudProject
    ? ({ kind: 'cloud' } as const)
    : githubRepo
      ? ({ kind: 'github', repo: githubRepo } as const)
      : ({ kind: 'local' } as const);

const yearField = (label = 'Year') =>
  fields.integer({ label, validation: { min: 1950, max: 2100 } });

export default config({
  storage,
  ...(cloudProject ? { cloud: { project: cloudProject } } : {}),
  ui: {
    brand: { name: 'Prof. Abolaji — website' },
    navigation: {
      'About me': ['profile', 'career'],
      Research: ['themes', 'projects', 'publications'],
      Network: ['places', 'collaborators'],
      Media: ['gallery', 'news'],
      Other: ['foundation'],
    },
  },

  singletons: {
    profile: singleton({
      label: 'Profile & contact',
      path: 'src/content/profile',
      format: { data: 'yaml' },
      schema: {
        name: fields.text({ label: 'Full name' }),
        honorific: fields.text({ label: 'Short name used in headings', description: 'e.g. Prof. Abolaji' }),
        role: fields.text({ label: 'Position title' }),
        department: fields.text({ label: 'Department / institution', multiline: true }),
        tagline: fields.text({
          label: 'One-line summary (homepage hero)',
          multiline: true,
          validation: { length: { max: 220 } },
        }),
        bio: fields.text({ label: 'Biography (paragraphs separated by a blank line)', multiline: true }),
        portrait: fields.image({
          label: 'Portrait',
          directory: 'public/images/profile',
          publicPath: '/images/profile/',
        }),
        cv: fields.file({
          label: 'CV file (PDF preferred)',
          directory: 'public/files',
          publicPath: '/files/',
        }),
        cvUpdated: fields.text({ label: 'CV last updated (e.g. August 2026)' }),
        metrics: fields.object(
          {
            publications: fields.integer({ label: 'Peer-reviewed publications' }),
            citations: fields.integer({ label: 'Citations (Google Scholar)' }),
            hIndex: fields.integer({ label: 'h-index' }),
            i10Index: fields.integer({ label: 'i10-index' }),
            trainees: fields.integer({ label: 'Students supervised' }),
            institutionsTrained: fields.integer({ label: 'Nigerian institutions trained' }),
            asOf: fields.text({ label: 'Metrics as of (e.g. August 2026)' }),
          },
          { label: 'Research metrics' },
        ),
        emails: fields.array(fields.text({ label: 'Email' }), {
          label: 'Email addresses',
          itemLabel: (p) => p.value,
        }),
        phone: fields.text({ label: 'Phone number' }),
        showPhone: fields.checkbox({ label: 'Show phone number on the website', defaultValue: false }),
        address: fields.text({ label: 'Postal address', multiline: true }),
        links: fields.object(
          {
            scholar: fields.url({ label: 'Google Scholar' }),
            orcid: fields.text({ label: 'ORCID iD (e.g. 0000-0002-4203-452X)' }),
            researchgate: fields.url({ label: 'ResearchGate' }),
            linkedin: fields.url({ label: 'LinkedIn' }),
            lab: fields.url({ label: 'Lab / centre website' }),
          },
          { label: 'Profiles' },
        ),
      },
    }),

    career: singleton({
      label: 'Career, honours & service',
      path: 'src/content/career',
      format: { data: 'yaml' },
      schema: {
        education: fields.array(
          fields.object({
            degree: fields.text({ label: 'Degree' }),
            field: fields.text({ label: 'Field' }),
            institution: fields.text({ label: 'Institution' }),
            year: yearField(),
            note: fields.text({ label: 'Note (optional)', multiline: true }),
          }),
          { label: 'Education', itemLabel: (p) => `${p.fields.degree.value} — ${p.fields.institution.value}` },
        ),
        appointments: fields.array(
          fields.object({
            role: fields.text({ label: 'Role' }),
            organisation: fields.text({ label: 'Organisation' }),
            start: yearField('Start year'),
            end: fields.text({ label: 'End (year, or leave blank for present)' }),
          }),
          { label: 'Appointments', itemLabel: (p) => `${p.fields.start.value ?? ''} ${p.fields.role.value}` },
        ),
        honours: fields.array(
          fields.object({
            title: fields.text({ label: 'Honour / fellowship' }),
            body: fields.text({ label: 'Awarding body / host' }),
            year: fields.text({ label: 'Year(s)' }),
          }),
          { label: 'Honours & fellowships', itemLabel: (p) => `${p.fields.year.value} ${p.fields.title.value}` },
        ),
        memberships: fields.array(fields.text({ label: 'Society' }), {
          label: 'Learned societies',
          itemLabel: (p) => p.value,
        }),
        service: fields.array(
          fields.object({
            role: fields.text({ label: 'Role' }),
            organisation: fields.text({ label: 'Journal / organisation' }),
          }),
          { label: 'Editorial & review service', itemLabel: (p) => `${p.fields.role.value} — ${p.fields.organisation.value}` },
        ),
        talks: fields.array(
          fields.object({
            title: fields.text({ label: 'Talk title' }),
            event: fields.text({ label: 'Event & place' }),
            year: yearField(),
          }),
          { label: 'Invited talks', itemLabel: (p) => `${p.fields.year.value} ${p.fields.title.value}` },
        ),
        teaching: fields.text({ label: 'Teaching summary', multiline: true }),
      },
    }),

    foundation: singleton({
      label: 'Foundation page',
      path: 'src/content/foundation',
      format: { data: 'yaml' },
      schema: {
        published: fields.checkbox({
          label: 'Show the Foundation page on the website',
          description: 'Leave unticked until the foundation is ready to be announced.',
          defaultValue: false,
        }),
        name: fields.text({ label: 'Foundation name' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        body: fields.text({ label: 'Details (paragraphs separated by a blank line)', multiline: true }),
      },
    }),
  },

  collections: {
    themes: collection({
      label: 'Research themes',
      path: 'src/content/themes/*',
      slugField: 'title',
      format: { data: 'yaml' },
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Theme' } }),
        order: fields.integer({ label: 'Display order', defaultValue: 10 }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        agents: fields.array(fields.text({ label: 'Compound / exposure' }), {
          label: 'Key compounds or exposures studied',
          itemLabel: (p) => p.value,
        }),
      },
    }),

    projects: collection({
      label: 'Grants & projects',
      path: 'src/content/projects/*',
      slugField: 'title',
      format: { data: 'yaml' },
      columns: ['title', 'start'],
      schema: {
        title: fields.slug({ name: { label: 'Project title' } }),
        funder: fields.text({ label: 'Funder' }),
        role: fields.text({ label: 'His role (e.g. Lead applicant / PI, Co-applicant)' }),
        lead: fields.text({ label: 'Lead applicant (if not him)' }),
        start: yearField('Start year'),
        end: fields.integer({ label: 'End year (blank if single year)' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        highlight: fields.checkbox({ label: 'Feature on Research page', defaultValue: false }),
      },
    }),

    publications: collection({
      label: 'Publications',
      path: 'src/content/publications/*',
      slugField: 'title',
      format: { data: 'yaml' },
      columns: ['title', 'year'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        authors: fields.text({ label: 'Authors', multiline: true }),
        journal: fields.text({ label: 'Journal / book / venue' }),
        year: yearField(),
        doi: fields.text({ label: 'DOI (e.g. 10.1038/s41598-025-00698-9)' }),
        url: fields.url({ label: 'Link (if no DOI)' }),
        kind: fields.select({
          label: 'Type',
          options: [
            { label: 'Journal article', value: 'article' },
            { label: 'Review', value: 'review' },
            { label: 'Book chapter', value: 'chapter' },
            { label: 'Preprint', value: 'preprint' },
            { label: 'Conference abstract', value: 'abstract' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'article',
        }),
        featured: fields.checkbox({ label: 'Feature on homepage', defaultValue: false }),
        hidden: fields.checkbox({
          label: 'Hide from website',
          description: 'Use this instead of deleting: works on his ORCID record are re-added automatically unless they exist here.',
          defaultValue: false,
        }),
      },
    }),

    places: collection({
      label: 'Institutions & places',
      path: 'src/content/places/*',
      slugField: 'name',
      format: { data: 'yaml' },
      columns: ['name', 'relation'],
      schema: {
        name: fields.slug({ name: { label: 'Institution' } }),
        city: fields.text({ label: 'City' }),
        country: fields.text({ label: 'Country' }),
        relation: fields.select({
          label: 'Relationship',
          options: [
            { label: 'Works here now', value: 'current' },
            { label: 'Worked / trained here', value: 'past' },
            { label: 'Research partner', value: 'partner' },
            { label: 'Funder', value: 'funder' },
          ],
          defaultValue: 'partner',
        }),
        years: fields.text({ label: 'Years (e.g. 2013–2014)' }),
        description: fields.text({ label: 'What he did / does here', multiline: true }),
        lat: fields.number({ label: 'Latitude (for the map)', step: 0.0001 }),
        lng: fields.number({ label: 'Longitude (for the map)', step: 0.0001 }),
        url: fields.url({ label: 'Website' }),
      },
    }),

    collaborators: collection({
      label: 'Collaborators',
      path: 'src/content/collaborators/*',
      slugField: 'name',
      format: { data: 'yaml' },
      columns: ['name', 'institution'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        institution: fields.text({ label: 'Institution' }),
        country: fields.text({ label: 'Country' }),
        work: fields.text({ label: 'Shared work', multiline: true }),
        url: fields.url({ label: 'Profile link' }),
        order: fields.integer({ label: 'Display order', defaultValue: 10 }),
      },
    }),

    gallery: collection({
      label: 'Gallery',
      path: 'src/content/gallery/*',
      slugField: 'title',
      format: { data: 'yaml' },
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Caption' } }),
        image: fields.image({
          label: 'Photo',
          directory: 'public/images/gallery',
          publicPath: '/images/gallery/',
          validation: { isRequired: true },
        }),
        alt: fields.text({ label: 'Describe the photo for screen readers' }),
        date: fields.date({ label: 'Date taken' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Laboratory', value: 'lab' },
            { label: 'Workshops & training', value: 'training' },
            { label: 'Conferences & talks', value: 'conference' },
            { label: 'Students & team', value: 'team' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'lab',
        }),
      },
    }),

    news: collection({
      label: 'News',
      path: 'src/content/news/*',
      slugField: 'title',
      format: { data: 'yaml' },
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Headline' } }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        link: fields.url({ label: 'Link to more (optional)' }),
      },
    }),
  },
});
