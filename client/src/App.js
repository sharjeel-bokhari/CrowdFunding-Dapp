import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState} from 'react';
import { AwardFill} from 'react-bootstrap-icons';
import artifact from './artifacts/contracts/donation.sol/Donation.json';

function App() {
  const [provider, setProvider] = useState(undefined);
  const [signer, setSigner] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [amount, setAmount] = useState('0');
  const [donations, setDonations] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const toString = bytes32 => ethers.utils.parseBytes32String(bytes32); // converts our bytes32 to a human readable form.
  const toWei = ether => ethers.utils.parseEther(ether); // converts ethers to wei.
  const toEther = wei => ethers.utils.formatEther(wei).toString(); // converts wei to ether.

    const init = async () => {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);
          console.log("Provider connected:", provider);
      
          const contract = new ethers.Contract(
            "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            artifact.abi,
            provider.getSigner()
          );
          setContract(contract);
            console.log(contract)
          const result = await contract.getDonations();
          const donations = result.map(el => [el[0], toEther(el[1])]);
          setDonations(donations);
        } catch (err) {
          console.log("Error connecting wallet:", err);
        }
      };
      
  useEffect(() => {
    init();
  },[signer])

//   const isConnected = () => (signer != undefined && signer != null);

  const getSigner = async provider => {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    console.log(signer);
    setSigner(signer);
  }

  const connect = async () => {
    await getSigner(provider);
    console.log("Signed Connected?:",signer);
    setIsConnected(true);
  }

  const sendDonation = async () => {
    console.log(signer);
    if (!signer) {
        console.error("Signer not connected. Please connect your wallet!");
        return;
      }
    const wei = toWei(amount);

    await signer.sendTransaction({
      to: contract.address,
      value: wei
    })
    setAmount('0');
  }

  return (
    <div className="App">
        <header className="App-header">
            <div className='"row' style={{display:'flex' ,width: '800px'}}>
                <div className='col-md-4'>
                    <div className='"row'>
                        <div style={{backgroundColor: 'black', borderRadius: '4em'}}>
                            <div className='col-md-12'>
                                <h1 className='donateHeader' style={{color: 'rgb(71,171,180'}}> 
                                    Donate ETH
                                </h1>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-6 amountButtonLeft'>
                            <a
                                onClick={ () => setAmount('0.1') }
                                className={'amountButton ' + (amount === '0.1' ? 'amountClicked' : '')}
                            >
                                0.1
                            </a>
                        </div>
                        <div className='col-md-6 amountButtonRight'>
                            <a
                                onClick={ () => setAmount('0.5') }
                                className={'amountButton ' + (amount === '0.5' ? 'amountClicked' : '')}
                            >
                                0.5
                            </a>
                        </div>
                        <div className='col-md-6 amountButtonLeft'>
                            <a
                                onClick={ () => setAmount('1') }
                                className={'amountButton ' + (amount === '1' ? 'amountClicked' : '')}
                            >
                                1
                            </a>
                        </div>
                        <div className='col-md-6 amountButtonRight'>
                            <a
                                onClick={ () => setAmount('2') }
                                className={'amountButton ' + (amount === '2' ? 'amountClicked' : '')}
                            >
                                2
                            </a>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-12'>
                            <a
                                onClick={ () => sendDonation() }
                                className='amountButton'
                            >
                                Donate
                            </a>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-12'>
                            {isConnected ? 
                                <>
                                    <span className='dot greenDot'></span>
                                    <p style={{fontSize: '25px'}}>
                                        Connected
                                    </p>
                                </>
                                :
                                <>
                                    <span className='dot redDot'></span>
                                    <p style={{fontSize:"25px"}}>
                                        Not Connected
                                    </p>
                                    <button onClick={connect} className='btn btn-primary' >
                                        Connect Wallet
                                    </button>
                                </>
                            }   
                        </div>
                    </div>
                </div>

                <div className='col-md-2'>
                </div>

                <div className='col-md-6'>
                    <div className='row'>
                    <div style={{backgroundColor: 'black', borderRadius: '4em'}}>
                        <div className='col-md-12'>
                            <h1 className='donateHeader' style={{color: 'rgb(71,171,180'}}>
                                Recent Donations
                            </h1>
                        </div>
                        </div>
                    </div>
                    
                    {donations.map((ds,idx) => (
                        <>
                            <div className='donationBubbleLeft'>
                                {/* <SuitHeartFill fill='#FF7F97' /> */}
                                <AwardFill fill='#000' size={30}/>
                                <span className='paddingLeft'>
                                    {ds[1]} ETH
                                    &nbsp;
                                    <span className='byAddress'> 
                                    by {ds[0]?.substring(0,14)}... 
                                    </span>
                                </span>
                            </div>

                        </>
                    ))}
                </div>
            </div>
        </header>
    </div>
  );
}

export default App;
