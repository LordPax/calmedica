import ChatBot from "@/components/features/chatbot/index";
import DimensionalCard from "@/components/ui/3dcards";
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import SaladeIcon from "@/components/ui/svg-salad";
import BurgerIcon from "@/components/ui/svg-burger";
import SteakIcon from "@/components/ui/svg-steak";
import SoupIcon from "@/components/ui/svg-soup";

export default async function HomePage() {
    return (
        <>
            <Header/>
            <ChatBot />
        </>
    );
}
