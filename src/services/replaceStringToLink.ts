import { deburr } from 'lodash';

export default function replaceStringToLink(val: string) {
  return deburr(val).toLowerCase().replaceAll(' ', '-');
}
