import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import PaymentForm from "./payment-form";
import { toast } from "react-toastify";
import {
  getConfig,
  createStripePayment,
} from "../../../api/endpoints/payment/stripe";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../../redux/reducers/authSlice";
import { enrollStudent } from "../../../api/endpoints/course/course";
import { Button } from "@material-tailwind/react";

function StripeContainer() {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [stripeError, setStripeError] = useState<string>("");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const {courseId} = useParams();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  
  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to continue with payment", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate(`/login?redirect=/courses/${courseId}/payment`);
    }
  }, [isLoggedIn, navigate, courseId]);

  const handleDirectEnrollment = async () => {
    if (!courseId) return;
    try {
      setIsEnrolling(true);
      const response = await enrollStudent(courseId);
      toast.success(response?.message || "Successfully enrolled in the course!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate(`/courses/${courseId}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Enrollment failed";
      toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const fetchConfig = async () => {
    try {
      const response = await getConfig();
      console.log("GetConfig full response:", response);
      // Service returns response.data which is: { status: 'success', message: '...', data: 'pk_...' }
      // So we need response.data to get the nested data object, then .data to get the key
      const publishableKey = response?.data || (response as any)?.data?.data;
      console.log("Publishable key extracted:", publishableKey);
      // Check if it's a real Stripe key (starts with pk_live_ or pk_test_)
      if (publishableKey && typeof publishableKey === 'string' && (publishableKey.startsWith('pk_live_') || publishableKey.startsWith('pk_test_'))) {
        setStripePromise(() => loadStripe(publishableKey));
        setStripeError("");
      } else {
        // Mock key or invalid - show direct enrollment option
        console.warn("Stripe not properly configured, showing direct enrollment option");
        setStripeError("Stripe payment is not configured. You can enroll directly for testing.");
      }
    } catch (error: any) {
      console.error("Error fetching Stripe config:", error);
      console.error("Error details:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
      if (error?.response?.status === 401) {
        toast.error("Please login to access payment", {position:toast.POSITION.BOTTOM_RIGHT});
        navigate('/login');
      } else if (error?.response?.status === 500) {
        // Stripe not configured - allow direct enrollment
        setStripeError("Stripe payment is not configured. You can enroll directly for testing.");
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to load payment configuration";
        setStripeError(errorMessage);
      }
    }
  };
  
  const paymentIntentHandler = async () => {
    if (!courseId) {
      toast.error("Course ID is missing", {position:toast.POSITION.BOTTOM_RIGHT});
      return;
    }
    try {
      const response = await createStripePayment(courseId);
      console.log("CreatePaymentIntent full response:", response);
      // Service returns response.data which is: { status: 'success', message: '...', data: { clientSecret: 'pi_...' } }
      // So we need response.data.data.clientSecret
      // Response structure: { status: 'success', data: { clientSecret: 'pi_...' } }
      // Service returns response.data, so we get: { status: 'success', data: { clientSecret: 'pi_...' } }
      const clientSecret = response?.data?.clientSecret || (response as any)?.data?.data?.clientSecret;
      console.log("Client secret extracted:", clientSecret);
      console.log("Full response structure:", JSON.stringify(response, null, 2));
      
      // Valid Stripe client secrets must start with 'pi_' or 'seti_' (real Stripe format)
      // Mock secrets won't work with Stripe Elements, so show direct enrollment option
      const isValidClientSecret = clientSecret && 
        typeof clientSecret === 'string' && 
        ((clientSecret.startsWith('pi_') && !clientSecret.includes('mock')) || 
         clientSecret.startsWith('seti_'));
      
      if (isValidClientSecret) {
        setClientSecret(clientSecret);
        setStripeError("");
      } else {
        console.warn("Invalid or mock client secret - showing direct enrollment option");
        console.error("Client secret:", clientSecret);
        setStripeError("Stripe payment is not configured. You can enroll directly for testing.");
      }
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      console.error("Error details:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      });
      // Check if it's an authentication error
      if (error?.response?.status === 401) {
        toast.error("Please login to continue with payment", {position:toast.POSITION.BOTTOM_RIGHT});
        navigate('/login');
      } else if (error?.response?.status === 500) {
        // Stripe not configured - allow direct enrollment
        setStripeError("Stripe payment is not configured. You can enroll directly for testing.");
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to initialize payment";
        setStripeError(errorMessage);
      }
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchConfig();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (courseId && isLoggedIn) {
      paymentIntentHandler();
    }
  }, [courseId, isLoggedIn]);

  return (
    <div className='p-5 flex items-center h-screen justify-center '>
      <div className=" w-1/2">
        {stripeError ? (
          <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 mb-4 font-semibold">{stripeError}</p>
            <p className="text-gray-600 mb-4">For development/testing, you can enroll directly without payment.</p>
            <Button
              color="green"
              onClick={handleDirectEnrollment}
              disabled={isEnrolling}
              className="w-full"
            >
              {isEnrolling ? "Enrolling..." : "Enroll Directly (Development Mode)"}
            </Button>
            <Button
              variant="outlined"
              color="blue"
              onClick={() => navigate(`/courses/${courseId}`)}
              className="w-full mt-2"
            >
              Go Back to Course
            </Button>
          </div>
        ) : !clientSecret || !stripePromise ? (
          <div className="text-center">
            <p className="text-gray-600">Loading payment form...</p>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default StripeContainer;
