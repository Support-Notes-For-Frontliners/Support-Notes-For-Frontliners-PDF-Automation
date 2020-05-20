import React from 'react'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from "@material-ui/core/Button"
import FormGroup from '@material-ui/core/FormGroup'

export default function Selector(props) {
    const [facilities, setFacilities] = React.useState({
        "Seattle Children's Bellevue Clinic and Surgery Center": false,
        "Overlake Medical Center & Clinics": false,
        "Sunrise Senior Living: Bellevue": false,
        "Harborview Medical Center": false,
        "Island House Assisted Living": false,
        "Virginia Mason Hospital and Seattle Medical Center": false,
      });    
      
     const [checked, setChecked] = React.useState({
        "approvalOnly": false,
        "unsentOnly": false
    })

    const handleChange = (event) => {
        setChecked({ ...checked, [event.target.name]: event.target.checked });
    };

    const handleFacilities = (event) => {
        setFacilities({...facilities, [event.target.name]: event.target.checked})
    }

    const handleSearch = (event) => {
        props.callBack(facilities, checked)
    }


    return (
        <div style={{width: "50%"}}>
            <h1>Support Notes For Frontliners PDF Automation</h1>
            <br />
            <br />
            <h3>Select the Facility</h3>
            <FormControlLabel label="Overlake Medical Center & Clinics" control={<Checkbox onChange={handleFacilities} name="Overlake Medical Center & Clinics" />}/>
            <FormControlLabel label="Virginia Mason Hospital and Seattle Medical Center" control={<Checkbox onChange={handleFacilities} name="Virginia Mason Hospital and Seattle Medical Center">Virginia Mason</Checkbox>}/>
            <FormControlLabel label="Harborview Medical Center" control={<Checkbox onChange={handleFacilities} name="Harborview Medical Center">Harborview Medical Center</Checkbox>}/>
            <FormControlLabel label="Seattle Children's Bellevue Clinic and Surgery Center" control={<Checkbox onChange={handleFacilities} name="Seattle Children's Bellevue Clinic and Surgery Center">Seattle Chidrens Hospital</Checkbox>}/>
            <FormControlLabel label="Island House Assisted Living" control={<Checkbox onChange={handleFacilities} name="Island House Assisted Living">Island House</Checkbox>}/>
            <FormControlLabel label="Sunrise Senior Living: Bellevue" control={<Checkbox onChange={handleFacilities} name= "Sunrise Senior Living: Bellevue">Sunrise Senior Living</Checkbox>}/>
            
            <h3>Filters</h3>
            <FormGroup row>
                <FormControlLabel
                    control={<Switch checked={checked.approvalOnly} onChange={handleChange} name="approvalOnly" />}
                    label="Approved Only"
                />
                <FormControlLabel
                    control={<Switch checked={checked.unsentOnly} onChange={handleChange} name="unsentOnly" />}
                    label="Unsent Only"
                />
            </FormGroup>

            <Button onClick={handleSearch}>Search</Button>

        </div>
    )
}