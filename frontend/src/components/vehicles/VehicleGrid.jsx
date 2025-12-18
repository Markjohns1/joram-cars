/**
 * Vehicle Grid Component
 * 
 * Displays vehicles in a responsive grid.
 */

import VehicleCard from './VehicleCard';
import { EmptyState, LoadingPage } from '../common';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VehicleGrid({
    vehicles = [],
    isLoading = false,
    emptyTitle = 'No vehicles found',
    emptyDescription = 'Try adjusting your filters or check back later for new listings.',
}) {
    if (isLoading) {
        return <LoadingPage />;
    }

    if (!vehicles || vehicles.length === 0) {
        return (
            <EmptyState
                icon={Car}
                title={emptyTitle}
                description={emptyDescription}
                action={
                    <Link to="/vehicles" className="btn btn-primary">
                        View All Vehicles
                    </Link>
                }
            />
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle, index) => (
                <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={index}
                />
            ))}
        </div>
    );
}
