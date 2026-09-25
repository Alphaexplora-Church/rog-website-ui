import type { MediaLibrary } from '../types/media'

/**
 * Sample Media Library — used ONLY when `VITE_USE_MOCKS=true` in
 * `.env.local`. The live site reads Strapi (see mediaApi.ts).
 *
 * Kept so the site can still be worked on without the CMS running. Doc 5
 * §5 conflict 7 is the rule: live data from day one, mocks are opt-in.
 *
 * Content is the six real @RIVEROFGODORTIGAS uploads seeded on 2026-09-22
 * (history in features/media/data/mediaData.ts). Five dates were never
 * confirmed and stay flagged as placeholders. All six are `category:
 * 'sermon'` since Sunday Service stopped being a series (2026-09-23), so the
 * Series category holds only two empty placeholder series here.
 */
export const sampleLibrary: MediaLibrary = {
  series: [
    { slug: 'ecclesiastes', title: 'Ecclesiastes', isPlaceholder: true },
    { slug: 'exodus', title: 'Exodus', isPlaceholder: true },
  ],
  topics: [
    { slug: 'end-times', title: 'End Times' },
    { slug: 'hope', title: 'Hope' },
    { slug: 'restoration', title: 'Restoration' },
    { slug: 'obedience', title: 'Obedience' },
    { slug: 'light-in-darkness', title: 'Light in Darkness' },
  ],
  scripture: [{ slug: 'jonah', title: 'Jonah' }],
  sermons: [
    {
      slug: 'the-end',
      title: 'The End',
      category: 'sermon',
      mediaType: 'youtube',
      videoId: 'P5OBtcgl3i8',
      speakerSlug: 'bp-chito-sanchez',
      speakerName: 'Bp. Chito Sanchez',
      date: 'Date pending',
      dateIsPlaceholder: true,
      topicSlugs: ['end-times'],
    },
    {
      slug: 'our-hope',
      title: 'Our Hope',
      category: 'sermon',
      mediaType: 'youtube',
      videoId: '8F0IS9Mtd0M',
      speakerSlug: 'bp-chito-sanchez',
      speakerName: 'Bp. Chito Sanchez',
      date: 'Date pending',
      dateIsPlaceholder: true,
      topicSlugs: ['hope'],
    },
    {
      slug: 'the-day-is-approaching',
      title: 'The Day Is Approaching',
      category: 'sermon',
      mediaType: 'youtube',
      videoId: 'bG6EsoQJ7K4',
      speakerSlug: 'bp-chito-sanchez',
      speakerName: 'Bp. Chito Sanchez',
      date: 'Date pending',
      dateIsPlaceholder: true,
      topicSlugs: ['end-times'],
    },
    {
      slug: 'lessons-from-jonah',
      title: 'Lessons From Jonah',
      category: 'sermon',
      mediaType: 'youtube',
      videoId: '5LYu2yTXgMo',
      speakerSlug: 'bp-chito-sanchez',
      speakerName: 'Bp. Chito Sanchez',
      date: 'Date pending',
      dateIsPlaceholder: true,
      topicSlugs: ['obedience'],
      scriptureSlug: 'jonah',
    },
    {
      slug: 'redemption-reconciliation-and-restoration',
      title: 'Redemption, Reconciliation and Restoration',
      category: 'sermon',
      mediaType: 'youtube',
      videoId: 'KTL0IompwUM',
      speakerSlug: 'pastor-rachel-sanchez',
      speakerName: 'Pastor Rachel Sanchez',
      date: 'Mar 10, 2024',
      isoDate: '2024-03-10',
      topicSlugs: ['restoration'],
    },
    {
      slug: 'light-in-the-darkness',
      title: 'Light in the Darkness',
      category: 'sermon',
      mediaType: 'youtube',
      videoId: 'whWY1SKVEeY',
      speakerSlug: 'pastor-rodel-buban',
      speakerName: 'Pastor Rodel Buban',
      date: 'Date pending',
      dateIsPlaceholder: true,
      topicSlugs: ['light-in-darkness'],
    },
  ],
}
