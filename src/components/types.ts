interface Datas {
    'data': {
      [dateString: string]: {
        [senderId: string]: {
          [targetId: string]: {
            [moduleName: string]: {
              count: number;
              type: string;
              commands: string[];
            };
          };
        };
      };
    },
    'modules': string[];
    'version': number;
    'timestamp': number;
  }