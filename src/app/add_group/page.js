"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import emailjs from "@emailjs/browser";

export default function AddGroup() {
  const { user } = useAuth();
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [inviteEmails, setInviteEmails] = useState([]);

  async function handleCreateGroup() { 
    const { data, error } = await supabase
      .from("groups")
      .insert([{ name: groupName, invited_emails: inviteEmails.split(','), created_by: user.id }])
      .select()


    if (data && data[0]) {
      await sendInvites(data[0]?.id)
    }
    if (error) {
      console.error("Error creating group:", error);
    } else {
      router.push("/");
    }
  }

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const sendInvites = async (groupId) => {
      const emails = inviteEmails.split(',')
        .map((email) => email.trim())
        .filter((email) => validateEmail(email));
        const groupLink = process.env.NODE_ENV === 'production'
        ? `https://splitwise-clone.vercel.app/join_group/${groupId}`  
        : `http://localhost:3000/join_group/${groupId}`;

      if (emails.length > 0) {
        setInviteEmails([]);
        for (const email of emails) {
          emailjs.send(
            "service_1uig6lz",
            "template_6dxjwu3",
            {
              to_name: "Viraj",
              to_email: email,
              from_name: "Shreyas",
              message: `Group invite: ${groupLink}` ,
            },
            "AVaP81TyCDlZxN-1L"
          );
        }
      } else {
        alert("Please enter valid email(s)");
      } 
  };


  return (
    <div className="flex justify-center">
    <div className="py-10 flex-1 justify-center lg:max-w-[50%] max-w-[85%]">
      <h1 className="lg:text-3xl text-2xl font-extrabold py-4">Create a group</h1>
        <>
        <div className="py-3">
        <p className="pb-2 font-medium text-base">Name your group</p>
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="p-[15px] h-14 rounded-xl"
          />
          </div>
          <div className="py-3">
          <p className="pb-2 font-medium text-base">Invite friends</p>
          <Input
            placeholder="Invite Member (Email)"
            value={inviteEmails}
            onChange={(e) => setInviteEmails(e.target.value)}
            className="p-[15px] h-14 rounded-xl"
          />
          </div>
          <div className="py-3">
          <Button className='w-full' onClick={handleCreateGroup}>Create</Button>
          </div>
        </>
    </div>
    </div>
  );
}
