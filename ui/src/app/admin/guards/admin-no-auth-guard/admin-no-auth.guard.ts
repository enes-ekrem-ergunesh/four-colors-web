import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {StorageService} from "../../../services/storage/storage.service";

export const adminNoAuthGuard: CanActivateFn = async () => {
  const storageService = inject(StorageService)
  const router = inject(Router)

  if (!storageService.isReady()) {
    await storageService.init()
  }
  const token = await storageService.get('admin_token');
  if (token) {
    router.navigate(['/admin-home']).then(() => {
      window.location.reload();
    })
    return false;
  }

  return true;
};
