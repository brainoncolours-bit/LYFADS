import { Russo_One, Inter, Roboto, Open_Sans, Lato, Nunito, Poppins } from 'next/font/google';

export const russo = Russo_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});
export const poppins = Poppins({
    subsets: ['latin-ext'],
    weight: ['400', '500',],
    display: 'swap',
})