import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {StorageService} from "../../../services/storage/storage.service";
import {AdminService} from "../../../services/api/admin/admin.service";
import {ConfigService} from "../../../services/config/config.service";
import {catchError, firstValueFrom, of} from "rxjs";

export const adminAuthGuard: CanActivateFn = async () => {
  const adminService = inject(AdminService)
  const storageService = inject(StorageService)
  const configService = inject(ConfigService)
  const router = inject(Router)

  if (!storageService.isReady()) {
    await storageService.init()
  }
  const token = await storageService.get('admin_token');
  if (!token) {
    router.navigate(['/admin-login']).then(() => {
      // window.location.reload();
    })
    return false;
  }

  const response = await firstValueFrom(
    (await adminService.validate()).pipe(
      catchError((error) => {
        configService.errorHandler(error, true);
        return of(false); // Return false in case of error
      })
    )
  );

  return response === 'OK';
};
