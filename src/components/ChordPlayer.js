// src/components/ChordPlayer.js
import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import '../styles.css';  // Adjusted path for all components

const importAllSounds = (requireContext) => {
    let sounds = {};
    requireContext.keys().forEach((item) => {
        sounds[item.replace('./', '')] = requireContext(item).default;
    });
    return sounds;
};

const pianoSounds = importAllSounds(require.context('../piano_mp3', false, /\.mp3$/));

const chordIntervals = {
    'Major 7': [0, 4, 7, 11],
    'Minor 7': [0, 3, 7, 10],
    'Dominant 7': [0, 4, 7, 10],
};

const baseNoteOrder = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const ChordPlayer = () => {
    const [currentRootNote, setCurrentRootNote] = useState('C');
    const [currentChordType, setCurrentChordType] = useState('Major 7');
    const [selectedChordNotes, setSelectedChordNotes] = useState([]);
    const [isSamplerLoaded, setIsSamplerLoaded] = useState(false);
    const [inversion, setInversion] = useState(0);

    const samplerRef = useRef(null);

    useEffect(() => {
        const newSampler = new Tone.Sampler({
            urls: Object.keys(pianoSounds).reduce((acc, soundFileName) => {
                const match = soundFileName.match(/Piano.ff.([A-Gb#]+)(\d).mp3/);
                if (match) {
                    const note = match[1];
                    const octave = match[2];
                    acc[`${note}${octave}`] = pianoSounds[soundFileName];
                }
                return acc;
            }, {}),
            release: 1,
            onload: () => {
                setIsSamplerLoaded(true);
                samplerRef.current = newSampler;
            },
        }).toDestination();
    }, []);

    useEffect(() => {
        if (isSamplerLoaded) {
            selectChordNotes();
        }
    }, [currentRootNote, currentChordType, isSamplerLoaded, inversion]);

    const selectChordNotes = () => {
        const intervals = chordIntervals[currentChordType];
        let startIndex = baseNoteOrder.indexOf(currentRootNote);
        let chordNotes = intervals.map(interval => baseNoteOrder[(startIndex + interval) % 12] + '3');

        for (let i = 0; i < inversion; i++) {
            let note = chordNotes.shift();
            note = note.replace(/[0-9]/, match => parseInt(match) + 1);
            chordNotes.push(note);
        }

        setSelectedChordNotes(chordNotes);
    };

    const invertChordUp = () => setInversion(prev => prev + 1);
    const invertChordDown = () => setInversion(prev => Math.max(prev - 1, 0));
    const playChord = async () => {
        if (Tone.context.state !== 'running') await Tone.start();
        selectedChordNotes.forEach(note => samplerRef.current && samplerRef.current.triggerAttackRelease(note, '1n'));
    };

    return (
        <div className="chord-player">
            {isSamplerLoaded ? (
                <>
                    <div>
                        <select className="chord-select" value={currentRootNote} onChange={e => setCurrentRootNote(e.target.value)}>
                            {baseNoteOrder.map(note => <option key={note} value={note}>{note}</option>)}
                        </select>
                        <select className="chord-select" value={currentChordType} onChange={e => setCurrentChordType(e.target.value)}>
                            {Object.keys(chordIntervals).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="chord-status">Selected Notes: {selectedChordNotes.join(', ')}</div>
                    <div>
                        <button className="chord-button" onClick={invertChordDown}>Invert Down</button>
                        <button className="chord-button" onClick={invertChordUp}>Invert Up</button>
                    </div>
                    <button className="chord-button" onClick={playChord}>Play Chord</button>
                </>
            ) : (
                <div className="chord-status">Loading sounds...</div>
            )}
        </div>
    );
};

export default ChordPlayer;
