export const canvas = document.getElementById('ui');
canvas.width = window.innerWidth * 1.33;
canvas.height = window.innerHeight * 1.33;
canvas.style.width = '100%';
canvas.style.height = '100%';

export const ctx = canvas.getContext('2d');