import backgroundMusic from './background-music.mp3';
import { cloudinaryFiles } from './cloudinaryImages';

const baseUrl = (import.meta.env.VITE_CLOUDINARY_BASE_URL ?? '').replace(/\/+$/, '');

const cloud = (key: string): string => `${baseUrl}/${cloudinaryFiles[key]}`;

export const assets = {
  frontCover: cloud('front-cover'),
  backCover: cloud('back-cover'),
  backgroundMusic,
  page01: cloud('page-01'),
  page02: cloud('page-02'),
  page03: cloud('page-03'),
  page04: cloud('page-04'),
  page05: cloud('page-05'),
  page06: cloud('page-06'),
  page07: cloud('page-07'),
  page08: cloud('page-08'),
  page09: cloud('page-09'),
  page10: cloud('page-10'),
  page11: cloud('page-11'),
  page12: cloud('page-12'),
  page13: cloud('page-13'),
  page14: cloud('page-14'),
  page15: cloud('page-15'),
  page16: cloud('page-16'),
  page17: cloud('page-17'),
  page18: cloud('page-18'),
  page19: cloud('page-19'),
  page20: cloud('page-20'),
  page21: cloud('page-21'),
  page22: cloud('page-22'),
  page23: cloud('page-23'),
  page24: cloud('page-24'),
};
