import { useAuth } from '../context/AuthContext';
import { useOwner } from '../context/OwnerContext';
import Header from './Header';
import Navbar from "../components/Navbar"
import RatingTable from './RatingTable';
import TopCard from './TopCards'
import NoStore from './NoStore'
import Welcome from './Welcome'

const OwnerDashboard = () => {
 
    const { user, logout } = useAuth(); 
    const { store, ratings, loading } = useOwner();

    if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;
    if (!store && !loading) return <NoStore logout={logout} />
    return (
        <div className="bg-gray-200/70 min-h-screen text-slate-900 font-sans">
            <Navbar user={user} logout={logout} />
            <div className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
                <Welcome user={user}/>
                <Header />
                <TopCard ratings={ratings} store={store} />
                <RatingTable ratings={ratings} />
            </div>
        </div>
    );
};

export default OwnerDashboard;
