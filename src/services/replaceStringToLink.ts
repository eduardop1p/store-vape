import { deburr } from 'lodash';

export default function replaceStringToLink(val: string) {
  const valuedDeburr = deburr(val).toLowerCase();

  return valuedDeburr.replaceAll(' - ', '-').replaceAll(' ', '-'); // eslint-disable-line
}
