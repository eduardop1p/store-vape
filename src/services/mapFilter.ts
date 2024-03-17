export default function mapFilter(array: any[], key: string) {
  return array.length ? array.map((val: string) => ({ [key]: val })) : [{}];
}
