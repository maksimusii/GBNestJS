import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/HelperFileLoader';
import { EditUserDto } from './dtos/edit-user-dto';

const PATH_NEWS = '\\news-static\\';
HelperFileLoader.path = PATH_NEWS;

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('api')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
      fileFilter: (req: Request, file, cb) => {
        const originalName = file.originalname.split('.');
        const fileExtension = originalName[originalName.length - 1];
        if (fileExtension.search(/jpe?g|png|gif/i) === -1) {
          return cb(
            new HttpException(
              'Extension of file not allowed',
              HttpStatus.NOT_ACCEPTABLE,
            ),
            false,
          );
        }
        return cb(null, true);
      },
    }),
  )
  async create(
    @Body() user: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    let avatarPath = undefined;
    if (avatar?.filename?.length > 0) avatarPath = PATH_NEWS + avatar.filename;
    return this.userService.create({ ...user, avatar: avatarPath });
  }

  @Put('/api/:userId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
      fileFilter: (req: Request, file, cb) => {
        const originalName = file.originalname.split('.');
        const fileExtension = originalName[originalName.length - 1];
        if (fileExtension.search(/jpe?g|png|gif/i) === -1) {
          return cb(
            new HttpException(
              'Extension of file not allowed',
              HttpStatus.NOT_ACCEPTABLE,
            ),
            false,
          );
        }
        return cb(null, true);
      },
    }),
  )
  async edit(
    @Body() user: EditUserDto,
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    let avatarPath = undefined;
    if (avatar?.filename?.length > 0) avatarPath = PATH_NEWS + avatar.filename;
    return this.userService.edit({ ...user, avatar: avatarPath }, userId);
  }

  @Get('/view/:userId')
  @Render('edit-user')
  async getNewsDetails(@Param('userId', ParseIntPipe) userId: number) {
    const _user = await this.userService.findById(userId);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новости не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      _user,
      userId,
    };
  }
}
