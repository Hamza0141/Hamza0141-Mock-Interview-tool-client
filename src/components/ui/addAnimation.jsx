import { useEffect } from 'react';
import { animate } from 'motion';
import { useLocation } from 'react-router-dom';

const AddAnimation = () => {
    const pathName = useLocation().pathname;

    useEffect(() => {
        const elements = document.querySelectorAll('[data-animation]');

        // Function to apply initial styles
        const applyInitialStyles = (el, type) => {
            switch (type) {
                case 'fade-up':
                    Object.assign(el.style, { opacity: 0, transform: 'translateY(50px)' });
                    break;
                case 'fade-down':
                    Object.assign(el.style, { opacity: 0, transform: 'translateY(-50px)' });
                    break;
                case 'fade-right':
                    Object.assign(el.style, { opacity: 0, transform: 'translateX(-50px)' });
                    break;
                case 'fade-zoom-in':
                    Object.assign(el.style, { opacity: 0, transform: 'scale(0.8)' });
                    break;
                default:
                    break;
            }
        };

        // Apply initial styles to all elements before observing
        elements.forEach((el) => {
            const type = el.getAttribute('data-animation');
            applyInitialStyles(el, type);
        });

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const type = el.getAttribute('data-animation');
                        const delay = el.getAttribute('data-delay');
                        const duration = 0.6;
                        const easing = 'ease-in-out';

                        let animationConfig = {};

                        switch (type) {
                            case 'fade-up':
                                animationConfig = {
                                    opacity: [0, 1],
                                    transform: ['translateY(50px)', 'translateY(0px)'],
                                };
                                break;
                            case 'fade-down':
                                animationConfig = {
                                    opacity: [0, 1],
                                    transform: ['translateY(-50px)', 'translateY(0px)'],
                                };
                                break;
                            case 'fade-right':
                                animationConfig = {
                                    opacity: [0, 1],
                                    transform: ['translateX(-50px)', 'translateX(0px)'],
                                };
                                break;
                            case 'fade-zoom-in':
                                animationConfig = {
                                    opacity: [0, 1],
                                    transform: ['scale(1)', 'scale(1)'],
                                };
                                break;
                            default:
                                break;
                        }

                        animate(
                            el,
                            animationConfig,
                            {
                                duration,
                                delay: delay ? parseFloat(delay) : 0,
                                easing,
                            }
                        );

                        observer.unobserve(el); // only animate once
                    }
                });
            },
            { threshold: 0.2 }
        );

        // Observe all data-aos elements
        elements.forEach((el) => observer.observe(el));

        // Cleanup observer on unmount or route change
        return () => {
            observer.disconnect();
        };
    }, [pathName]);

    return null;
};

export default AddAnimation;