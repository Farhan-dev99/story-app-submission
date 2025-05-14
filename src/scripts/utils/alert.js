import Swal from 'sweetalert2';

export const errorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: `${message}`,
  });
};

export const successAlert = (message) => {
  Swal.fire({
    title: 'Berhasil!',
    text: `${message}`,
    icon: 'success',
    confirmButtonText: 'OK',
  });
};

export const confirmAlert = (message) => {
  return Swal.fire({
    title: 'Apakah kamu yakin?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Logout!',
  }).then((result) => {
    return result.isConfirmed;
  });
};
