import { CalcService, Values } from './calc.service';
import {
  Controller,
  Put,
  Headers,
  Param,
  Query,
  Body,
  Patch,
} from '@nestjs/common';

@Controller('calc')
export class CalcController {
  constructor(private readonly CalcService: CalcService) {}

  @Put('/')
  @Patch('/')
  calc(
    @Headers() headers: Headers,
    @Query() query?: Values,
    @Body() values?: Values,
  ): number | string {
    console.log(Body);
    const val1 = query.val1 | values.val1;
    const val2 = query.val2 | values.val2;
    return this.CalcService.calc(headers['type-operation'], val1, val2);
  }

  @Put('/:val1/:val2')
  @Patch('/:val1/:val2')
  calcparam(
    @Headers() headers: Headers,
    @Param('val1') paramval1?: number,
    @Param('val2') paramval2?: number,
  ): number | string {
    const val1 = +paramval1;
    const val2 = +paramval2;
    return this.CalcService.calc(headers['type-operation'], val1, val2);
  }
}
