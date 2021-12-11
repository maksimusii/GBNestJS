import { Injectable } from '@nestjs/common';

export interface Values {
  val1: number;
  val2: number;
}

@Injectable()
export class CalcService {
  calc(oper: string, val1?: number, val2?: number): number | string {
    switch (oper) {
      case 'plus':
        return val1 + val2;
      case 'mult':
        return val1 * val2;
      case 'sub':
        return val1 - val2;
      default:
        return 'Тип операции указан не верно';
    }
  }
}
