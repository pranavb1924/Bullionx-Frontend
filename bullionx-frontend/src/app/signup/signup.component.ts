import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Added for routerLink support
import { SignupService } from '../signup.service'; // <--- Import your service

interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterModule],  // Added RouterModule here
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Inject the SignupService via the constructor
  constructor(private signupService: SignupService) {}

  ngOnInit(): void {
    this.startCandlestickAnimation();
  }

  // Updated onSubmit to call the service
  onSubmit() {
    // Call your service method (e.g., createUser) to POST user data
    this.signupService.registerUser(this.user).subscribe({
      next: (response) => {
        console.log('User Registered (from backend):', response);
        alert('Signup successful!'); 
      },
      error: (error) => {
        console.error('Error registering user:', error);
        alert('Signup failed! Please check the console or backend logs.');
      }
    });
  }

  // Candlestick animation logic remains the same
  startCandlestickAnimation() {
    const canvas = document.getElementById('stockCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    window.addEventListener('resize', () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });

    const candleWidth = 10;
    const candleSpacing = 5;
    const totalCandleWidth = candleWidth + candleSpacing;
    let numCandles = Math.floor(canvas.width / totalCandleWidth) + 2;

    let candles: Candle[] = [];
    const basePrice = canvas.height / 2;

    function generateCandle(prev: Candle | null): Candle {
      const open = prev ? prev.close : basePrice;
      const change = Math.random() * 200 - 100;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 80;
      const low = Math.min(open, close) - Math.random() * 40;
      return { open, high, low, close };
    }

    for (let i = 0; i < numCandles; i++) {
      const candle = i === 0 ? generateCandle(null) : generateCandle(candles[i - 1]);
      candles.push(candle);
    }

    let offsetX = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      numCandles = Math.floor(canvas.width / totalCandleWidth) + 2;

      for (let i = 0; i < candles.length; i++) {
        const candle = candles[i];
        const x = i * totalCandleWidth - offsetX;
        if (x < -candleWidth || x > canvas.width) continue;

        const centerX = x + candleWidth / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, candle.high);
        ctx.lineTo(centerX, candle.low);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        const bodyColor = candle.close >= candle.open ? '#1ec776' : '#e74c3c';
        const bodyTop = Math.min(candle.open, candle.close);
        const bodyHeight = Math.abs(candle.close - candle.open) || 1;

        ctx.fillStyle = bodyColor;
        ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
      }

      offsetX += 0.5;
      if (offsetX >= totalCandleWidth) {
        offsetX = 0;
        candles.shift();
        const lastCandle = candles[candles.length - 1];
        candles.push(generateCandle(lastCandle));
      }

      requestAnimationFrame(animate);
    };

    animate();
  }
}
