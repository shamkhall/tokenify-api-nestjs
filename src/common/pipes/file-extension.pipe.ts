import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpStatus,
  UnprocessableEntityException
} from "@nestjs/common";

@Injectable()
export class FileExtensionPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {

    const validTypes = ['jpeg', 'jpg', 'png'];
    const validationRegex = `\\.(${validTypes.join('|')})$`
    const imageName = value?.originalname;
    if(imageName === undefined) return true;
    if(!imageName?.match(new RegExp(validationRegex))) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Invalid MIME type detected',
        valid_types: validTypes,
        error: 'Bad Request',
      })
    }
    value.ex = imageName?.match(new RegExp(validationRegex))[1];
    return value;
  }
}
