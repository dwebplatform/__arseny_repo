interface IConfig {
  privateKey: string;
  saltRound: number;
  storeImagePath: string;
  staticPath: string;
}

export const config: IConfig = {
  privateKey: 'kitty_mitty',
  saltRound: 10,
  staticPath: 'static',
  storeImagePath: 'images',
};
