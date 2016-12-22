declare module NodeJS {
  export interface Global {
    bakaru: {
      debug: boolean,
      paths: {
        // Vendors
        wcjs?: string,
        ffmpeg?: string,

        // UI
        mainWindowUrl?: string,
        remoteWindowUrls?: string[],

        // FS paths
        data?: string,
        temp?: string,
        library?: string,
        preferences?: string,

        // Others
        [key: string]: any
      },
      addresses: string[]
    }
  }
}