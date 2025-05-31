import { useState } from 'react'
import { ethers } from 'ethers'
import { verifyProof } from '../utils/zkpUtils'

const ZKPVerifier = () => {
  const [verificationResult, setVerificationResult] = useState('')
  
  const demonstrateSecurity = () => {
    // Example values
    const pin = "1234"
    const originalProof = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(pin))
    const storedWitness = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(originalProof))
    
    // Demonstrate that even with the witness, you can't derive the PIN
    setVerificationResult(`
      Original PIN: Hidden
      Stored Witness: ${storedWitness}
      Can derive PIN from Witness? No (One-way hash function)
      Verification Success: ${verifyProof(originalProof, storedWitness)}
    `)
  }

  return (
    <div className="zkp-verifier">
      <h3>ZKP Security Demonstration</h3>
      <button onClick={demonstrateSecurity}>Demonstrate Security</button>
      <pre>{verificationResult}</pre>
    </div>
  )
}

export default ZKPVerifier