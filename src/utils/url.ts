export function noTrailingSlash(...paths: string[]): string {
  if (paths.length === 0) {
    return "";
  }

  if (paths.length === 1) {
    let path = paths[0]?.trim();
    if (!path || path === "/") {
      return "";
    }
    if (path.endsWith("/")) {
      path = path.slice(0, path.length - 1);
    }
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    return path
  }

  return noTrailingSlash(paths[0]) + noTrailingSlash(...paths.slice(1));
}

export function withLeadingSlash(...paths: string[]): string {
  if (paths.length === 0) {
    return "/";
  }

  if (paths.length === 1) {
    let path = paths[0]?.trim();
    if (!path || path === "/") {
      return "/";
    }
    if (!path.startsWith("/")) {
      path = "/" + path;
    }
    return path
  }

  return withLeadingSlash(paths[0]) + withLeadingSlash(...paths.slice(1));
}
