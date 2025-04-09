import { UPDATE_SEEDBOX_ENTRY } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import './style.css'; 

interface SeedUpdateProps {
    entry: {
        _id: string;
        seedDepth: string;
        seedSpacing: string;
        waterRequirements: string;
        sunlightRequirements: string;
        frostHardy: boolean;
        sowDate?: string;
        notes?: string;
    };
}

const SeedUpdate = ({entry}: SeedUpdateProps) => {
    console.log("SeedUpdate entry:", entry);
    const [updateSeedBoxEntry] = useMutation(UPDATE_SEEDBOX_ENTRY);
    const [frostHardy, setFrostHardy] = useState(entry.frostHardy);
    const [sowDate, setSowDate] = useState(entry.sowDate || '');
    const [notes, setNotes] = useState(entry.notes || '');
    const [showSaveMessage, setShowSaveMessage] = useState(false);

    const handleFrostHardyChange = () => {
        setFrostHardy(!frostHardy);
    }
    const handleSowDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSowDate(event.target.value);
    }
    const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value);
    }

    const handleSave = async () => {
        try {
            await updateSeedBoxEntry({
                variables: {
                    frostHardy: frostHardy,
                    sowDate: sowDate,
                    notes: notes,
                    entryId: entry._id,
                }
            });
            setShowSaveMessage(true);  
            setTimeout(() => setShowSaveMessage(false), 4000);  
        } catch (error) {
            console.error("Error updating seed box entry:", error);
            alert("Failed to update seed box entry.");
        }
    }
 
    return (
        <ul className="seed-packet-details">
            <li><strong>Seed Depth:</strong> {entry.seedDepth}</li>
            <li><strong>Seed Spacing:</strong> {entry.seedSpacing}</li>
            <li><strong>Water:</strong> {entry.waterRequirements}</li>
            <li><strong>Sunlight:</strong> {entry.sunlightRequirements}</li>
            <li>
                  <strong>Frost Hardy?:</strong>
                  <input
                    type="checkbox"
                    checked={frostHardy}
                    style={{ marginLeft: '0.5em' }}
                    onChange={handleFrostHardyChange}
                  />
                </li>
         
                <li>
                    <strong>Sow Date:</strong>
                    <input
                        type="date"
                        value={sowDate}
                        onChange={handleSowDateChange}
                        style={{ marginLeft: '0.5em' }}
                    />
                </li>

        
                <li>
                    <strong>Notes:</strong>
                    <textarea
                        value={notes}
                        onChange={handleNotesChange}
                        style={{ marginLeft: '0.5em', width: '100%', height: '50px' }}
                    />
                </li>
        
                <button
                className="save-button"
                onClick={handleSave}
            >Save</button>

            {showSaveMessage && (
                <div className="save-message">
                    Entry saved!
                </div>
            )}
        </ul>
    );
}

export default SeedUpdate;






