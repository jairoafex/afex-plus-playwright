import * as os from "os";

export function getLocalIp(): string {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;

    for (const info of iface) {
      if (info.family !== "IPv4" || info.internal) continue;

      // Devolver solo IPs de LAN real — saltar el rango 172.16-31.x.x de WSL2
      const isWsl2 = /^172\.(1[6-9]|2\d|3[01])\./.test(info.address);
      if (!isWsl2) return info.address;
    }
  }

  return "localhost";
}
