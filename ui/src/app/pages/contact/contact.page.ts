import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Nav} from "../../interfaces/ui/nav";
import {NavbarComponent} from "../../components/complex/navbar/navbar.component";
import {User} from "../../interfaces/api/user";
import {StorageService} from "../../services/storage/storage.service";
import {UserService} from "../../services/api/user/user.service";
import {ConfigService} from "../../services/config/config.service";
import {catchError} from "rxjs";
import {Popover} from "bootstrap";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class ContactPage implements OnInit {
  navs: Nav[] = [
    {
      name: 'Home',
      route: '/home',
    },
    {
      name: 'Courses',
      route: '/courses',
      dropdown: [
        {
          name: 'English',
          route: '/courses/english'
        },
        {
          name: 'Math',
          route: '/courses/math'
        },
        {
          name: 'Science',
          route: '/courses/science'
        },
      ]
    },
    {
      name: 'Contact',
      route: '/contact',
    },
    {
      name: 'About',
      route: '/about',
    },
  ]
  user: User | null = null;
  emailPopover: Popover | null = null;
  isEmailPopoverVisible: boolean = false;
  whatsappPopover: Popover | null = null;
  isWhatsappPopoverVisible: boolean = false;
  instagramPopover: Popover | null = null;
  isInstagramPopoverVisible: boolean = false;
  popoverTimeout: any = null;

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private configService: ConfigService,
  ) {
  }

  async ngOnInit() {
    const token = await this.storageService.get('token')
    if (token) {
      (await this.userService.get_self())
        .pipe(
          catchError(error => {
            this.configService.errorHandler(error, false, false)
            throw error
          })
        )
        .subscribe(user => {
          this.user = user as User
        })
    }
    this.emailPopover = new Popover(document.getElementById('copy-email') as Element, {
      content: "copied",
      trigger: "manual",
      placement: "right",
    })
    this.whatsappPopover = new Popover(document.getElementById('copy-whatsapp') as Element, {
      content: "copied",
      trigger: "manual",
      placement: "right",
    })
    this.instagramPopover = new Popover(document.getElementById('copy-instagram') as Element, {
      content: "copied",
      trigger: "manual",
      placement: "right",
    })
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }

  copyToClipboard(text: string, type: string) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
      if (type == 'email') this.showEmailPopover()
      if (type == 'whatsapp') this.showWhatsappPopover()
      if (type == 'instagram') this.showInstagramPopover()
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  }

  showEmailPopover() {
    if (this.popoverTimeout) {
      clearTimeout(this.popoverTimeout)
      if (!this.isEmailPopoverVisible) {
        this.hideAllPopovers()
      }
      else {
        return
      }
    }
    if (this.emailPopover) {
      this.emailPopover.show()
      this.isEmailPopoverVisible = true
    }

    this.popoverTimeout = setTimeout(() => {
      if (this.emailPopover) {
        this.emailPopover.hide()
        this.isEmailPopoverVisible = false
        this.popoverTimeout = null
      }
    }, 2000)
  }
  showWhatsappPopover() {
    if (this.popoverTimeout) {
      clearTimeout(this.popoverTimeout)
      if (!this.isWhatsappPopoverVisible) {
        this.hideAllPopovers()
      }
      else {
        return
      }
    }
    if (this.whatsappPopover) {
      this.whatsappPopover.show()
      this.isWhatsappPopoverVisible = true
    }

    this.popoverTimeout = setTimeout(() => {
      if (this.whatsappPopover) {
        this.whatsappPopover.hide()
        this.isWhatsappPopoverVisible = false
        this.popoverTimeout = null
      }
    }, 2000)
  }
  showInstagramPopover() {
    if (this.popoverTimeout) {
      clearTimeout(this.popoverTimeout)
      if (!this.isInstagramPopoverVisible) {
        this.hideAllPopovers()
      }
      else {
        return
      }
    }
    if (this.instagramPopover) {
      this.instagramPopover.show()
      this.isInstagramPopoverVisible = true
    }

    this.popoverTimeout = setTimeout(() => {
      if (this.instagramPopover) {
        this.instagramPopover.hide()
        this.isInstagramPopoverVisible = false
        this.popoverTimeout = null
      }
    }, 2000)
  }

  hideAllPopovers() {
    if (this.emailPopover) {
      this.emailPopover.hide()
      this.isEmailPopoverVisible = false
    }
    if (this.whatsappPopover) {
      this.whatsappPopover.hide()
      this.isWhatsappPopoverVisible = false
    }
    if (this.instagramPopover) {
      this.instagramPopover.hide()
      this.isInstagramPopoverVisible = false
    }
  }

}
