import React, { useState, useEffect } from 'react';
import './Zone1.css';

const eventDatabase = [
    {
        id: '001',
        category: 'Hackathon',
        title: 'CODE SPRINT 2026',
        topic: 'Code Sprint',
        description: 'Join the ultimate 24-hour hackathon hosted by the CSE department. Build innovative solutions, win exciting cash prizes, and get noticed by top tech recruiters!',
        specifications: [
            { label: 'Duration', value: '24 hours' },
            { label: 'Team Size', value: '3-4' },
            { label: 'Prize Pool', value: '₹1,00,000' }
        ]
    },
    {
        id: '002',
        category: 'Guest Lecture',
        title: 'AI IN CYBERSECURITY',
        topic: 'Cyber AI',
        description: 'An exclusive session by industry experts on how AI is revolutionizing threat detection and ethical hacking. Open to all students.',
        specifications: [
            { label: 'Duration', value: '2 hours' },
            { label: 'Format', value: 'Offline' },
            { label: 'Certificate', value: 'Yes' }
        ]
    },
    {
        id: '003',
        category: 'Workshop',
        title: 'WEB3 & BLOCKCHAIN',
        topic: 'Web3',
        description: 'A hands-on workshop covering smart contracts, Ethereum, and decentralized apps. Prerequisite: Basic JavaScript.',
        specifications: [
            { label: 'Duration', value: '1 Day' },
            { label: 'Pre-req', value: 'JS Basics' },
            { label: 'Hands-on', value: 'Yes' }
        ]
    },
    {
        id: '004',
        category: 'Cultural',
        title: 'CSE DEPARTMENT DAY',
        topic: 'Dept Day',
        description: 'Celebrate our department with music, dance, drama, and the much-awaited award ceremony honoring top academic performers.',
        specifications: [
            { label: 'Date', value: 'TBA' },
            { label: 'Venue', value: 'F Block' },
            { label: 'Dress Code', value: 'Ethnic' }
        ]
    },
    {
        id: '005',
        category: 'Alumni Meet',
        title: 'TECH ALUMNI CONNECT',
        topic: 'Alumni',
        description: 'Network with our distinguished alumni currently working at Google, Microsoft, and Amazon. Learn from their journeys and secure mentorships.',
        specifications: [
            { label: 'Network', value: 'Global' },
            { label: 'Mentors', value: 'FAANG' },
            { label: 'Registration', value: 'Free' }
        ]
    }
];

export default function Zone1() {
    const [items, setItems] = useState([...eventDatabase]);
    const [sliderClass, setSliderClass] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSliderClass('next');
        setItems(prev => {
            const newItems = [...prev];
            const first = newItems.shift();
            newItems.push(first);
            return newItems;
        });
        setTimeout(() => {
            setSliderClass('');
            setIsAnimating(false);
        }, 1200); // Wait for transition
    };

    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSliderClass('prev');
        setItems(prev => {
            const newItems = [...prev];
            const last = newItems.pop();
            newItems.unshift(last);
            return newItems;
        });
        setTimeout(() => {
            setSliderClass('');
            setIsAnimating(false);
        }, 1200); // Wait for transition
    };

    const handleSeeMore = () => {
        setSliderClass('showDetail');
    };

    const handleBack = () => {
        setSliderClass('');
    };

    return (
        <div style={{width: '100%', height: 'calc(100vh - 70px)', overflow: 'hidden', position: 'relative', background: 'var(--bg)'}}>
            <div className={`zone1-carousel ${sliderClass}`}>
                <div className="list">
                    {items.map((item, index) => {
                        // The items are mapped according to their position in the state array
                        return (
                            <div className="item" key={item.id}>
                                <img src={`/img/zone1/${item.id}.png`} alt={item.title} />
                                <div className="introduce">
                                    <div className="title" style={{color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase'}}>{item.category}</div>
                                    <div className="topic" style={{color: 'var(--text-h)'}}>{item.topic}</div>
                                    <div className="des" style={{color: 'var(--text)'}}>{item.description}</div>
                                    <button className="seeMore" onClick={handleSeeMore} style={{color: 'var(--accent)', borderColor: 'var(--accent)'}}>
                                        SEE MORE &#8599;
                                    </button>
                                </div>
                                <div className="detail">
                                    <div className="title" style={{color: 'var(--text-h)'}}>{item.title}</div>
                                    <div className="des" style={{color: 'var(--text)'}}>{item.description}</div>
                                    <div className="specifications" style={{color: 'var(--text)', borderColor: 'var(--border)'}}>
                                        {item.specifications.map((spec, i) => (
                                            <div key={i}>
                                                <p style={{color: 'var(--muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em'}}>{spec.label}</p>
                                                <p style={{color: 'var(--text-h)', fontWeight: 800}}>{spec.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="checkout">
                                        <button style={{color: 'var(--text-h)', borderColor: 'var(--border)', background: '#fff', fontWeight: 700}}>REGISTER</button>
                                        <button style={{backgroundColor: 'var(--accent)', color: '#fff', border: 'none', fontWeight: 700, boxShadow: '0 4px 14px rgba(37,99,235,0.3)'}}>SCHEDULE</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="arrows">
                    <button id="prev" onClick={handlePrev}>&lt;</button>
                    <button id="next" onClick={handleNext}>&gt;</button>
                    <button id="back" onClick={handleBack} style={{color: 'var(--accent)', borderColor: 'var(--accent)'}}>See All Highlights &#8599;</button>
                </div>
            </div>
        </div>
    );
}
