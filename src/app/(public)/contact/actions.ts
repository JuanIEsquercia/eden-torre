'use server'

export async function submitContact(prevState: any, formData: FormData) {
    // Mock email sending
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    console.log("New Contact:", { name, email, message })

    await new Promise(resolve => setTimeout(resolve, 1000))

    return { success: true, message: "Mensaje enviado correctamente. Nos pondremos en contacto pronto." }
}
