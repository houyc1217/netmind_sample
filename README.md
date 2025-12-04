# NetMind Company Website

A modern, responsive company website built with HTML, CSS, and JavaScript, featuring a complete CI/CD pipeline for automated deployment to GitHub Pages.

## Features

- 🎨 Modern and responsive design
- 📱 Mobile-friendly navigation
- ⚡ Smooth scrolling and animations
- 📊 Animated statistics counter
- 📧 Contact form
- 🚀 Automated CI/CD deployment

## Sections

- **Hero**: Eye-catching landing section with call-to-action
- **About**: Company information with animated statistics
- **Services**: Six key service offerings with icons
- **Contact**: Contact form and company information
- **Footer**: Social links and copyright

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- GitHub Actions (CI/CD)
- GitHub Pages (Hosting)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/houyc1217/netmind_sample.git
cd netmind_sample
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

3. Visit `http://localhost:8000` in your browser

## Deployment

The website is automatically deployed to GitHub Pages using GitHub Actions. Any push to the `main` branch triggers the CI/CD pipeline:

1. **Build**: Validates HTML/CSS/JS files
2. **Test**: Runs basic checks
3. **Deploy**: Publishes to GitHub Pages

## CI/CD Pipeline

The GitHub Actions workflow includes:

- Automatic deployment on push to main branch
- HTML/CSS validation
- JavaScript linting
- Automated deployment to GitHub Pages

## Live Demo

Visit the live website at: `https://houyc1217.github.io/netmind_sample/`

## License

MIT License - feel free to use this template for your own projects!

## Contact

For questions or feedback, please reach out to contact@netmind.com
