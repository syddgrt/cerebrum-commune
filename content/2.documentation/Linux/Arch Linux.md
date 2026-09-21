---
title: Manual Arch Linux Installation Explained
description: A practical walkthrough explaining why each installation step matters.
date: 2026-09-18
category: Linux
readingTime: 15
featured: true
published: true
---

## Overview (Super Simplified)

This guide documents a **simple manual Arch Linux installation**.

It is intentionally minimal and focuses on **why** each step matters rather than simply listing commands. The goal is to get a **bootable, usable Arch system** while helping readers build a high-level mental model of the installation process.

---

## 1. Boot From Arch ISO
::steps{level="4"}

#### Steps

1. Get a spare USB drive
  (or any drive/storage device that can be plugged into the device you want Arch installed)
::warning
The drive data will be completely erased during flash
::
2. Go to [`archlinux.org`](https://archlinux.org/download/)
3. Download the ISO file 
::note
The above link is specifically for AMD64/x86 Architecture
For ARM64. See [`archlinuxarm.org`](https://archlinuxarm.org/about/downloads)
::
4. Flash the drive 
  using 3rd party tools like [Rufus](https://rufus.ie/en/)
5. Plug the USB drive 
  into the machine where Arch will be installed
6. Power on the machine and enter the **Boot Menu or BIOS**
   - Common keys:
     - **Lenovo** → `F12`, `F1`
     - **Dell** → `F12`
     - **HP** → `Esc`, then `F9`
     - **ASUS / MSI** → `F2`, `DEL`
7. Select the USB device and boot from it
8. You should now land in the `Arch Linux Live Environment` in the root shell `root@archiso`


## 2. Inside Arch live Environment

Remember, you are not in actual Arch Linux yet, you are basically just configuring the Arch setup through the USB live environment

1. Use [`IWD (iNet Wireless Daemon) `] to configure a temporary wireless network access
  ```bash
  iwctl
  device list
  station DEVICE_NAME get-networks
  station DEVICE_NAME connect NETWORK_NAME
  
  ```
  - Boom, your're temporarily connected to the wifi, this is a non persistent network if your device goes to sleep, you have to reconfigure the iwctl again (unless you run it as a service but that is a topic for another day)

## 3. Partition the Disk

#### Steps

1. **List all available disks**
   ```bash
   lsblk
   ```
   - Look for your target disk (usually `/dev/sda`, `/dev/nvme0n1`, etc.)
   - **Don't touch your USB drive** (it's where you booted from)

2. **Launch partitioning tool**
   ```bash
   cfdisk /dev/YOUR_DISK
   ```
   > **Note:** Replace `YOUR_DISK` with actual disk name like `sda` or `nvme0n1`

3. **Create partitions:**
   - **EFI System Partition** → 512M (type: EFI System)
   - **Swap** → 2-4GB (type: Linux swap) 
     > **Note:** Swap size: typically RAM size or 2GB minimum. Optional but recommended
   - **Root** → Remaining space (type: Linux filesystem)

4. **Write changes and quit**
   - Select `Write` → type `yes` → `Quit`

---

## 4. Format the Partitions

Now we make these partitions actually usable by formatting them with filesystems

#### Steps

1. **Format EFI partition as FAT32**
   ```bash
   mkfs.fat -F32 /dev/YOUR_EFI_PARTITION
   ```
   > **Note:** Example: `/dev/sda1` or `/dev/nvme0n1p1`

2. **Format root partition as ext4**
   ```bash
   mkfs.ext4 /dev/YOUR_ROOT_PARTITION
   ```
   > **Note:** Example: `/dev/sda3` or `/dev/nvme0n1p3`

3. **Setup swap**
   ```bash
   mkswap /dev/YOUR_SWAP_PARTITION
   swapon /dev/YOUR_SWAP_PARTITION
   ```

---

## 5. Mount the Partitions

We mount partitions so the installer knows where to put files

#### Steps

1. **Mount root partition**
   ```bash
   mount /dev/YOUR_ROOT_PARTITION /mnt
   ```

2. **Create EFI mount point and mount it**
   ```bash
   mkdir -p /mnt/boot/efi
   mount /dev/YOUR_EFI_PARTITION /mnt/boot/efi
   ```

3. **Verify mounts**
   ```bash
   lsblk
   ```
   - You should see your partitions mounted at `/mnt` and `/mnt/boot/efi`

---

## 6. Install Base System

This is where we actually install Arch onto the disk

#### Steps

1. **Install essential packages**
   ```bash
   pacstrap /mnt base linux linux-firmware nano networkmanager
   ```
   > **Note:** 
   > - `base` → minimal Arch system
   > - `linux` → the kernel
   > - `linux-firmware` → hardware drivers
   > - `nano` → text editor (use `vim` if you prefer)
   > - `networkmanager` → for wifi/networking after reboot

2. **Wait for installation to complete**
   - This takes a few minutes depending on connection speed

---

## 7. Configure the System

#### Steps

1. **Generate filesystem table**
   ```bash
   genfstab -U /mnt >> /mnt/etc/fstab
   ```
   > **Note:** This tells the system which partitions to mount on boot

2. **Change root into new system**
   ```bash
   arch-chroot /mnt
   ```
   - You're now inside the actual Arch installation

3. **Set timezone**
   ```bash
   ln -sf /usr/share/zoneinfo/REGION/CITY /etc/localtime
   hwclock --systohc
   ```
   > **Note:** Example: `/usr/share/zoneinfo/Asia/Kuala_Lumpur`  
   > Use `ls /usr/share/zoneinfo/` to explore available regions

4. **Set locale**
   ```bash
   nano /etc/locale.gen
   ```
   - Uncomment your locale (e.g., `en_US.UTF-8 UTF-8`)
   - Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`)
   
   ```bash
   locale-gen
   echo "LANG=en_US.UTF-8" > /etc/locale.conf
   ```

5. **Set hostname**
   ```bash
   echo "YOUR_HOSTNAME" > /etc/hostname
   ```
   > **Note:** Replace `YOUR_HOSTNAME` with whatever you want to name your machine

6. **Create hosts file**
   ```bash
   nano /etc/hosts
   ```
   Add these lines:
   ```
   127.0.0.1    localhost
   ::1          localhost
   127.0.1.1    YOUR_HOSTNAME.localdomain YOUR_HOSTNAME
   ```

7. **Set root password**
   ```bash
   passwd
   ```
   - Enter a password twice

---

## 8. Install Bootloader

Without a bootloader, the system won't know how to start

#### Steps

1. **Install GRUB and EFI tools**
   ```bash
   pacman -S grub efibootmgr
   ```

2. **Install GRUB to EFI partition**
   ```bash
   grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
   ```

3. **Generate GRUB config**
   ```bash
   grub-mkconfig -o /boot/grub/grub.cfg
   ```

---

## 9. Enable NetworkManager

So you can actually connect to wifi after reboot

```bash
systemctl enable NetworkManager
```

---

## 10. Create User Account (Optional but Recommended)

Don't run everything as root – it's unsafe

#### Steps

1. **Install sudo**
   ```bash
   pacman -S sudo
   ```

2. **Create user**
   ```bash
   useradd -m -G wheel -s /bin/bash YOUR_USERNAME
   passwd YOUR_USERNAME
   ```

3. **Give user sudo privileges**
   ```bash
   EDITOR=nano visudo
   ```
   - Uncomment this line:
   ```
   %wheel ALL=(ALL:ALL) ALL
   ```
   - Save and exit

---

## 11. Reboot Into Arch

#### Steps

1. **Exit chroot**
   ```bash
   exit
   ```

2. **Unmount partitions**
   ```bash
   umount -R /mnt
   ```

3. **Reboot**
   ```bash
   reboot
   ```

4. **Remove USB drive** when prompted

5. **Boot into your new Arch system**
   - Login with your username and password
   - To connect to wifi:
     ```bash
     nmtui
     ```
     - Select `Activate a connection` → choose network → enter password

---

## 12. Post-Installation (What's Next?)

You now have a minimal Arch system. Here's what you probably want next:

#### Steps

1. **Install a desktop environment** (if you want a GUI)
   - GNOME: `sudo pacman -S gnome gdm`
   - KDE Plasma: `sudo pacman -S plasma kde-applications`
   - XFCE: `sudo pacman -S xfce4 xfce4-goodies`
   - Enable display manager: `sudo systemctl enable gdm` (or `sddm` for KDE)

2. **Install essential tools**
   ```bash
   sudo pacman -S git base-devel firefox
   ```

3. **Setup AUR helper** (for extra packages)
   ```bash
   git clone https://aur.archlinux.org/yay.git
   cd yay
   makepkg -si
   ```

---

## Why Did We Do All This?

- **Partitioning** → Separates system files, boot files, and swap space
- **Formatting** → Creates filesystems so the OS can read/write data
- **Mounting** → Tells the installer where to put files
- **pacstrap** → Actually installs the base system
- **fstab** → Remembers which partitions to mount on boot
- **chroot** → Lets us configure the installed system before booting into it
- **Bootloader** → Starts the OS when you power on
- **NetworkManager** → Handles wifi/ethernet connections

---

**Congratulations!** You've installed Arch Linux the manual way. You now understand the basics of what makes a Linux system bootable.
