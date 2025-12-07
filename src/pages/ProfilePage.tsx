import { Header } from '@/components/layout/Header';
import { ProfilePage as ProfileContent } from '@/components/profile/ProfilePage';

export default function ProfilePage() {
  return (
    <div className="pb-24">
      <Header />
      <ProfileContent />
    </div>
  );
}
