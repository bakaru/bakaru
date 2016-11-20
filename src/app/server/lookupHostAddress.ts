import { networkInterfaces } from 'os';

const interfaces = networkInterfaces();

console.log(global.bakaru);

for (const k in interfaces) {
  for (const k2 in interfaces[k]) {
    const address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
      global.bakaru.addresses.push(address.address);
    }
  }
}
