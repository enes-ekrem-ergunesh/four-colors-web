import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {StorageService} from "../../services/storage/storage.service";
import {ConfigService} from "../../services/config/config.service";
import {catchError, firstValueFrom, of} from "rxjs";
import {UserService} from "../../services/api/user/user.service";

export const userAuthGuard: CanActivateFn = async () => {

  const userService = inject(UserService)
  const storageService = inject(StorageService)
  const configService = inject(ConfigService)
  const router = inject(Router)

  if (!storageService.isReady()) {
    await storageService.init()
  }
  const token = await storageService.get('token');
  if (!token) {
    router.navigate(['/login']).then(() => {
      window.location.reload();
    })
    return false;
  }

  const response = await firstValueFrom(
    (await userService.validate()).pipe(
      catchError((error) => {
        configService.errorHandler(error);
        console.log("userAuthGuard error: ", error);
        return of(false);
      })
    )
  );


  return response === 'OK';
};
